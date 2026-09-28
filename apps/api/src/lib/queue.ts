import amqp, {
  AmqpConnectionManager,
  ChannelWrapper,
} from "amqp-connection-manager";
import type { ConfirmChannel, ConsumeMessage } from "amqplib";
import { envConfig } from "@/config/env.config";

export const QUEUES = {
  IMAGE_PROCESSING: "image-processing",
  IMAGE_RESULTS: "image-results",
} as const;

class QueueService {
  private connection: AmqpConnectionManager | null = null;
  private channelWrapper: ChannelWrapper | null = null;

  private init(): void {
    if (this.connection) return;

    this.connection = amqp.connect([envConfig.RABBITMQ_URL]);

    this.connection.on("connect", () => {
      console.log("[RabbitMQ] Conectado com sucesso");
    });

    this.connection.on("disconnect", (params) => {
      console.warn("[RabbitMQ] Desconectado, tentando reconectar...", params?.err);
    });

    this.channelWrapper = this.connection.createChannel({
      json: true,
      setup: async (channel: ConfirmChannel) => {
        await channel.assertQueue(QUEUES.IMAGE_PROCESSING, { durable: true });
        await channel.assertQueue(QUEUES.IMAGE_RESULTS, { durable: true });
      },
    });
  }

  async publish(queueName: string, data: object): Promise<boolean> {
    this.init();
    if (!this.channelWrapper) {
      throw new Error("RabbitMQ channel não inicializado");
    }

    await this.channelWrapper.sendToQueue(queueName, data, {
      persistent: true,
    });
    return true;
  }

  async consume(
    queueName: string,
    onMessage: (content: any) => Promise<void>,
  ): Promise<void> {
    this.init();
    if (!this.connection) {
      throw new Error("RabbitMQ connection não inicializada");
    }

    const consumerChannel = this.connection.createChannel({
      setup: async (channel: ConfirmChannel) => {
        await channel.assertQueue(queueName, { durable: true });
        await channel.prefetch(1);

        await channel.consume(queueName, async (msg: ConsumeMessage | null) => {
          if (!msg) return;

          try {
            const content = JSON.parse(msg.content.toString());
            await onMessage(content);
            channel.ack(msg);
          } catch (error) {
            console.error(`Erro processando mensagem da fila ${queueName}:`, error);
            if (msg.fields.redelivered) {
              channel.nack(msg, false, false);
            } else {
              channel.nack(msg, false, true);
            }
          }
        });
      },
    });

    await consumerChannel.waitForConnect();
  }
}

export const queue = new QueueService();
