import { ImageIcon } from "lucide-react";

export default function ToolsSection() {
  return (
    <div className="border rounded-md p-4">
      <h2 className="text-xl font-bold mb-4">Tools library</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div className="flex items-center">
          <div className="border rounded-md p-2">
            <ImageIcon />
          </div>
          <div className="ml-2">
            <p className="text-sm font-semibold">Remove Background</p>
            <p className="text-xs text-muted-foreground">
              Remove the background from your images with AI.
            </p>
          </div>
        </div>

        <div className="flex items-center">
          <div className="border rounded-md p-2">
            <ImageIcon />
          </div>
          <div className="ml-2">
            <p className="text-sm font-semibold">Sharpen</p>
            <p className="text-xs text-muted-foreground">
              Sharpen your images.
            </p>
          </div>
        </div>

        <div className="flex items-center">
          <div className="border rounded-md p-2">
            <ImageIcon />
          </div>
          <div className="ml-2">
            <p className="text-sm font-semibold">Black and White</p>
            <p className="text-xs text-muted-foreground">
              Convert your images to black and white.
            </p>
          </div>
        </div>

        <div className="flex items-center">
          <div className="border rounded-md p-2">
            <ImageIcon />
          </div>
          <div className="ml-2">
            <p className="text-sm font-semibold">Crop image</p>
            <p className="text-xs text-muted-foreground">Crop your images.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
