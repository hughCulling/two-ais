import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Check, Info } from "lucide-react";
import { AVAILABLE_LLMS } from '@/lib/models';
import { useTranslation } from '@/hooks/useTranslation';

type SafeTranslation = {
  modelSelector?: {
    previewBadge?: string;
    freeTierNote?: string;
  };
  [key: string]: any; // Allow other translation keys
};

const getSafeTranslation = (t: any): SafeTranslation => {
  return t || {};
};


interface ModelSelectorProps {
  value: string;
  onChange: (id: string) => void;
  disabled?: boolean;
  label: string;
  placeholder?: string;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  value,
  onChange,
  disabled = false,
  label,
  placeholder = 'Select a model',
}) => {
  const { t: translation } = useTranslation();
  
  // Filter only Mistral AI models
  const mistralModels = AVAILABLE_LLMS.filter(model => model.provider === 'Mistral AI');
  
  // Get the selected model info
  const selectedModel = mistralModels.find(model => model.id === value);
  
  // Safely access translation object with fallbacks
  const t = getSafeTranslation(translation);
  
  // Helper function to safely call translation functions
  const getTranslatedNote = (note: any) => {
    if (typeof note === 'function') {
      return note(translation || {});
    }
    return note;
  };
  
  // Format price for display
  const formatPrice = (price: number) => {
    return price.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 3,
    });
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="model-selector">{label}</Label>
      <Select 
        value={value} 
        onValueChange={onChange}
        disabled={disabled}
      >
        <SelectTrigger id="model-selector" className="w-full">
          <SelectValue placeholder={placeholder}>
            {selectedModel ? (
              <div className="flex items-center">
                <span className="font-medium">{selectedModel.name}</span>
                <span className="ml-2 text-sm text-muted-foreground">
                  (${formatPrice(selectedModel.pricing.input)} / {formatPrice(selectedModel.pricing.output)} per 1M tokens)
                </span>
              </div>
            ) : null}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="max-h-96">
          {mistralModels.map((model) => (
            <SelectItem 
              key={model.id} 
              value={model.id}
              className="py-3"
            >
              <div className="flex flex-col">
                <div className="flex items-center">
                  <span className="font-medium">{model.name}</span>
                  {model.status === 'preview' && (
                    <span className="ml-2 text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-0.5 rounded-full">
                      {t.modelSelector?.previewBadge || 'Preview'}
                    </span>
                  )}
                </div>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <span>
                    ${formatPrice(model.pricing.input)} / {formatPrice(model.pricing.output)} per 1M tokens
                  </span>
                  <span className="mx-2">•</span>
                  <span>
                    {model.contextWindow.toLocaleString()} tokens
                  </span>
                </div>
                {model.knowledgeCutoff && (
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <Info className="h-3 w-3 mr-1 flex-shrink-0" />
                    <span>Knowledge cutoff: {model.knowledgeCutoff}</span>
                  </div>
                )}
                {model.pricing.freeTier?.available && (
                  <div className="flex items-center text-xs text-green-600 dark:text-green-400 mt-1">
                    <Check className="h-3 w-3 mr-1 flex-shrink-0" />
                    <span>{t.modelSelector?.freeTierNote || 'Free tier available'}</span>
                  </div>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedModel?.pricing.note && (
        <p className="text-xs text-muted-foreground">
          {typeof selectedModel.pricing.note === 'function' 
            ? getTranslatedNote(selectedModel.pricing.note)
            : selectedModel.pricing.note}
        </p>
      )}
    </div>
  );
};
