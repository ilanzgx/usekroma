# Catalogo de Ideias e Proximos Passos (Kroma)

Este documento mapeia oportunidades de expansao de ferramentas para o Kroma, dividido em:
1. Recursos que rodam com codigo puro sobre as bibliotecas ja existentes (OpenCV, Pillow, NumPy e rembg).
2. Modelos neurais em formato ONNX leves e compativeis com o runtime existente (onnxruntime) na CPU.

---

## 1. Ferramentas sem novas dependencias (Custo zero de disco)

Estas funcionalidades aproveitam exclusivamente os pacotes que ja compoem o container do Worker. Nao exigem download de novos pesos neurais nem aumento de imagem Docker.

### A. Modo Retrato / Desfoque de Fundo
- O que faz: mantem a pessoa ou objeto em foco e desfoca o plano de fundo com suavidade.
- Como funciona: extrai a mascara com o rembg (U2-Net), aplica cv2.GaussianBlur ou cv2.bilateralFilter na imagem de fundo e faz a recombinacao com NumPy.
- Custo de CPU: medio (apenas o tempo normal do rembg somado a alguns milissegundos de convolucao).

### B. AI Upscale 4x
- O que faz: quadruplica a resolucao original restaurando detalhes de bordas.
- Como funciona: o Dockerfile ja efetua o download do arquivo LapSRN_x4.pb. Basta expor a operacao no Worker apontando para esse modelo via cv2.dnn_superres.
- Custo de CPU: alto. A versao 4x consome cerca de 3 a 5 vezes mais tempo de CPU que a versao 2x.

### C. Foto para Documento e Perfil (LinkedIn / RG / Passaporte)
- O que faz: substitui o fundo transparente por um fundo solido (branco, azul, cinza corporativo) ou gradiente.
- Como funciona: aplica a mascara alfa do recorte sobre uma tela preenchida com a cor RGB informada.
- Custo de CPU: baixo (alem do recorte ja existente).

### D. Mascara de Silhueta / Alfa Puro
- O que faz: devolve apenas a mascara binaria em preto e branco do recorte para uso em editores vetoriais ou design.
- Como funciona: chamada direta ao rembg passando o parametro `only_mask=True`.
- Custo de CPU: identico ao da remocao de fundo padrao.

### E. Destaque de Cor (Color Splash)
- O que faz: preserva a cor original do sujeito e converte todo o fundo para preto e branco.
- Como funciona: aplica a mascara do rembg para mesclar o recorte original com a versao dessaturada (cv2.cvtColor).
- Custo de CPU: baixo.

### F. Reducao de Ruido Noturno (Photo Denoise)
- O que faz: limpa granulados e ruidos digitais em fotos tiradas em baixa luminosidade ou ISO alto.
- Como funciona: cv2.fastNlMeansDenoisingColored.
- Custo de CPU: medio a alto. Recomenda-se limitar a resolucao de entrada antes do calculo.

### G. Scanner de Documentos e Recibos
- O que faz: transforma fotos de folhas de papel ou recibos em versoes binarizadas de alto contraste, faceis de ler e imprimir.
- Como funciona: escala de cinza e cv2.adaptiveThreshold com mediana.
- Custo de CPU: insignificante.

### H. Realce Adaptativo de Sombras e Luz (CLAHE)
- O que faz: recupera detalhes em fotos escuras ou tiradas contra o sol sem estourar as areas ja iluminadas.
- Como funciona: conversao para espaco de cor LAB e equalizacao adaptativa de histograma (cv2.createCLAHE) no canal de luminosidade.
- Custo de CPU: baixo.

### I. Inversao de Cores / Negativo
- O que faz: inverte canais de cor simulando filme negativo.
- Como funciona: cv2.bitwise_not.
- Custo de CPU: insignificante.

### J. Correcao Automatica de Orientacao EXIF
- O que faz: desvira fotos que sobem deitadas ou de cabeca para baixo devido a metadados do giroscopio de celulares.
- Como funciona: PIL.ImageOps.exif_transpose.
- Custo de CPU: insignificante.

### K. Otimizador e Conversor de Formato (PNG / JPEG / WebP)
- O que faz: converte entre formatos e comprime o peso do arquivo para carregamento rapido na web.
- Como funciona: rotina Pillow com controle de qualidade e flags de otimizacao direto em memoria.
- Custo de CPU: baixo.

### L. Efeito Pixel Art Retro
- O que faz: converte fotos em ilustracoes pixeladas estilo jogos classicos.
- Como funciona: downscaling agressivo com redimensionamento inverso usando interpolacao Nearest Neighbor.
- Custo de CPU: insignificante.

### M. Duotone (Estilo Spotify)
- O que faz: projeta a imagem inteira entre duas cores selecionadas.
- Como funciona: tabela de busca (cv2.LUT) mapeada a partir da escala de cinza.
- Custo de CPU: insignificante.

### N. Marca d'Agua (Watermark)
- O que faz: aplica texto ou logo com controle de opacidade e posicao.
- Como funciona: composicao de canal alfa no Pillow ou cv2.addWeighted.
- Custo de CPU: insignificante.

---

## 2. Modelos neurais em formato ONNX (Inferencia via CPU)

Como o worker ja conta com o `onnxruntime` integrado, qualquer um destes modelos pode ser carregado via `InferenceSession` sob demanda (padrao lazy loading).

### A. Restauracao e Nitidez Facial (GFPGAN / CodeFormer)
- O que faz: recupera rostos borrados, sem foco ou pixelados, reconstruindo olhos, boca e textura de pele de forma nitida.
- Arquivo ONNX: GFPGANv1.4.onnx ou CodeFormer.onnx.
- Peso: ~60 MB a 100 MB.
- Desempenho em CPU: ~2 a 4 segundos por foto.
- Aplicacao: ferramenta de alto apelo comercial para fotos de familia antigas e retratos de baixa qualidade.

### B. Apagador Magico / Remocao de Objetos (LaMa Inpainting)
- O que faz: remove pessoas, objetos ou defeitos marcados pelo usuario com um pincel, preenchendo o fundo de forma coerente.
- Arquivo ONNX: LaMa-float32.onnx ou LaMa-quantized.onnx.
- Peso: ~100 MB (ou ~50 MB quantizado).
- Desempenho em CPU: ~1.5 a 3 segundos para resolucoes ate 512x512.
- Aplicacao: ferramenta muito requisitada em suites modernas de edicao.

### C. Super-Resolucao Moderna (Real-ESRGAN Compact)
- O que faz: upscale que reconstrói texturas reais e elimina artefatos de compressao JPEG tipicos de redes sociais e WhatsApp.
- Arquivo ONNX: realesr-general-x4v3.onnx ou 4x-UltraSharp.onnx.
- Peso: ~17 MB a 35 MB.
- Desempenho em CPU: ~3 a 6 segundos.
- Aplicacao: substituto ou complemento moderno para o LapSRN.

### D. Iluminacao Noturna com Zero Ruido (Zero-DCE++ / SCI)
- O que faz: clareia imagens escuras tiradas a noite ou em interiores escuros ajustando curvas de exposicao de forma dinamica, sem gerar granulado artificial.
- Arquivo ONNX: Zero-DCE++.onnx.
- Peso: menos de 1 MB (apenas ~10.000 parametros, cerca de 300 kB).
- Desempenho em CPU: ~15 a 40 milissegundos (execucao quase instantanea).
- Aplicacao: excelente para correcao automatica de fotos escuras sem impacto em disco.

### E. Transformacao em Estilo Anime / Ilustracao (AnimeGANv3 / AnimeGANv2)
- O que faz: converte fotos de pessoas ou paisagens em ilustracoes artisticas com estilos reconheciveis (Studio Ghibli, Makoto Shinkai, quadrinhos).
- Arquivo ONNX: AnimeGANv3_Hayao.onnx ou AnimeGANv3_PortraitSketch.onnx.
- Peso: ~2.4 MB a 8.5 MB.
- Desempenho em CPU: ~80 a 150 milissegundos por foto.
- Aplicacao: ferramenta com alto potencial de compartilhamento e viralizacao em redes sociais.

### F. Deteccao Facial e Anonimizacao Automatica (YuNet)
- O que faz: localiza com precisao todos os rostos e placas em fotos para aplicar tarja preta, desfoque ou pixelizacao automatica.
- Arquivo ONNX: face_detection_yunet_2023mar.onnx.
- Peso: ~2 MB.
- Desempenho em CPU: ~20 a 50 milissegundos.
- Aplicacao: conformidade com privacidade (LGPD/GDPR) para fotos publicas e de eventos.

### G. Colorizacao de Fotos Antigas Preto e Branco (DDColor)
- O que faz: infere cores realistas para fotos historicas ou retratos originalmente em escala de cinza.
- Arquivo ONNX: ddcolor_tiny.onnx.
- Peso: ~80 MB a 120 MB.
- Desempenho em CPU: ~2 a 5 segundos.
- Aplicacao: recuperacao e memoria familiar, publico com forte apego emocional.

### H. Estimativa de Profundidade 3D (Depth-Anything-V2 Small / MiDaS)
- O que faz: gera um mapa de profundidade continuo, calculando a distancia exata de cada objeto em relacao a lente.
- Arquivo ONNX: depth_anything_v2_vits_int8.onnx ou midas_v21_small.onnx.
- Peso: ~27 MB (quantizado INT8) a 95 MB.
- Desempenho em CPU: ~300 a 700 milissegundos.
- Aplicacao: permite criar desfoques gradativos e fisicamente realistas (onde o fundo distante borra mais que o meio-campo), alem de efeitos de paralaxe 3D.

### I. Desfoque de Movimento e Recuperacao de Foco (NAFNet Tiny)
- O que faz: desfaz o borrao causado por trepidação da camera ou movimento rapido de pessoas (motion deblur).
- Arquivo ONNX: nafnet_deblur_tiny.onnx.
- Peso: ~25 MB a 40 MB.
- Desempenho em CPU: ~1.5 a 3 segundos.
- Aplicacao: recuperacao de fotos descartadas por estarem tremidas.

### J. Deteccao e Leitura de Texto em Imagens (PP-OCRv4)
- O que faz: localiza regioes com caracteres e devolve a transcricao textual com coordenadas precisas.
- Arquivo ONNX: ppocr_det.onnx + ppocr_rec.onnx.
- Peso: ~15 MB no conjunto completo.
- Desempenho em CPU: ~200 a 600 milissegundos.
- Aplicacao: copia de texto em fotos, digitalizacao de notas fiscais e traducao de prints.

### K. Segmentacao Interativa por Clique (MobileSAM)
- O que faz: o usuario clica em qualquer ponto da foto e o modelo isola o objeto correspondente sem necessidade de pintar contornos.
- Arquivo ONNX: mobile_sam_encoder.onnx + mobile_sam_decoder.onnx.
- Peso: ~40 MB no total.
- Desempenho em CPU: ~1 segundo para gerar os embeddings da imagem e menos de 50 milissegundos para responder a cada clique subsequente.
- Aplicacao: selecao avancada para edicoes pontuais.

### L. Extracao de Desenho de Contorno e Line Art (Anime2Sketch)
- O que faz: extrai linhas e tracos limpos em preto e branco de qualquer desenho ou foto, simulando traçado a nanquim ou line art de ilustracao.
- Arquivo ONNX: anime2sketch.onnx.
- Peso: ~8 MB.
- Desempenho em CPU: ~150 a 300 milissegundos.
- Aplicacao: base para coloristas, desenhistas e criacao de livros de colorir infantis.

### M. Mapeamento Facial e Edicao de Beleza (BiSeNet Face Parsing)
- O que faz: segmenta com exatidao anatomica cabelo, pele, sobrancelhas, olhos, labios e dentes.
- Arquivo ONNX: bisenet_face_parsing.onnx.
- Peso: ~13 MB.
- Desempenho em CPU: ~100 a 250 milissegundos.
- Aplicacao: permite filtros inteligentes de clareamento dental, suavizacao de pele sem borrar os olhos, ou troca de cor de cabelo/batom.

### N. Recorte de Retratos Ultraleve (MODNet)
- O que faz: remove o fundo exclusivamente de retratos humanos com excelente tratamento em fios de cabelo soltos.
- Arquivo ONNX: modnet_photographic_portrait_matting.onnx.
- Peso: ~25 MB.
- Desempenho em CPU: cerca de 3 vezes mais rapido que o U2-Net para fotos focadas em pessoas.
- Aplicacao: alternativa rapida para fotos de perfil e passaporte.

### O. Desentortamento de Documentos e Paginas (DocRes Dewarping)
- O que faz: retifica fotos de paginas de livros curvas ou folhas de papel dobradas, transformando-as em folhas planas.
- Arquivo ONNX: docres_dewarp.onnx.
- Peso: ~45 MB.
- Desempenho em CPU: ~1 a 2 segundos.
- Aplicacao: utilitario de produtividade para estudantes e escritorios.

---

## 3. Matriz Comparativa de Modelos ONNX

| Modelo | Objetivo | Tamanho ONNX | Tempo CPU | Relevancia Comercial |
| :--- | :--- | :---: | :---: | :---: |
| **Zero-DCE++** | Clarear fotos escuras | < 1 MB | ~20ms | Alta (peso desprezivel) |
| **YuNet** | Deteccao e anonimizacao | ~2 MB | ~30ms | Alta (privacidade/LGPD) |
| **AnimeGANv3** | Estilo anime / Ghibli | ~3 MB | ~100ms | Muito alta (viralizacao) |
| **Anime2Sketch** | Extracao de traco / Line art | ~8 MB | ~200ms | Media |
| **BiSeNet** | Mapeamento facial / Beauty | ~13 MB | ~150ms | Alta |
| **PP-OCRv4** | Leitura de texto em fotos | ~15 MB | ~300ms | Alta (utilitario) |
| **Real-ESRGAN** | Upscale moderno e texturas | ~17 MB | ~4s | Altissima |
| **MODNet** | Recorte leve de pessoas | ~25 MB | ~400ms | Alta |
| **Depth-Anything-V2** | Profundidade e desfoque real | ~27 MB | ~400ms | Alta |
| **NAFNet** | Desfazer tremor de camera | ~35 MB | ~2s | Media |
| **MobileSAM** | Recorte guiado por clique | ~40 MB | ~1s | Muito alta |
| **DocRes** | Desentortar papel/recibo | ~45 MB | ~1.5s | Media |
| **GFPGAN** | Restaurar rostos borrados | ~60 MB | ~3s | Altissima |
| **DDColor** | Colorir fotos antigas | ~90 MB | ~3s | Alta |
| **LaMa** | Apagar objetos / Inpainting | ~100 MB | ~2s | Altissima |
