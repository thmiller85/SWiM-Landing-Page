import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Check, Upload, Search } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface ClientImage {
  id: number;
  filename: string;
  originalName: string;
  altText: string | null;
  caption: string | null;
  url: string;
  size: number;
  mimeType: string;
  width: number | null;
  height: number | null;
  createdAt: Date;
}

interface ImagePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (imageUrl: string) => void;
  currentImage?: string | null;
}

export function ImagePickerModal({ isOpen, onClose, onSelect, currentImage }: ImagePickerModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(currentImage || null);

  const { data: images = [], isLoading } = useQuery<ClientImage[]>({
    queryKey: ['cms-images'],
    queryFn: () => apiRequest('/api/cms/images'),
  });

  const filteredImages = images.filter(image => 
    searchQuery === '' || 
    image.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
    image.altText?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = () => {
    if (selectedImage) {
      onSelect(selectedImage);
      onClose();
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('image', file);
    formData.append('altText', file.name.split('.')[0].replace(/-|_/g, ' '));
    
    try {
      const response = await fetch('/api/cms/images/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const newImage = await response.json();
        setSelectedImage(newImage.url);
        // Invalidate the images cache to refresh the list
        queryClient.invalidateQueries({ queryKey: ['cms-images'] });
        toast({
          title: "Success",
          description: "Image uploaded successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Select Featured Image</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search images..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div>
              <input
                type="file"
                id="modalImageUpload"
                accept="image/*"
                className="hidden"
                onChange={handleUpload}
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById('modalImageUpload')?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="text-center py-8 text-gray-500">Loading images...</div>
            ) : filteredImages.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No images found</div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {filteredImages.map((image) => (
                  <Card
                    key={image.id}
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      selectedImage === image.url ? 'ring-2 ring-accent' : ''
                    }`}
                    onClick={() => setSelectedImage(image.url)}
                  >
                    <div className="relative aspect-video">
                      <img
                        src={image.url}
                        alt={image.altText || image.filename}
                        className="w-full h-full object-cover rounded-t"
                      />
                      {selectedImage === image.url && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-t">
                          <Check className="h-8 w-8 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="p-2">
                      <p className="text-sm font-medium truncate">{image.filename}</p>
                      <p className="text-xs text-gray-500 truncate">{image.altText || 'No alt text'}</p>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSelect} disabled={!selectedImage}>
              Select Image
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}