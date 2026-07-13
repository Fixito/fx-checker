import SwapIcon from '@/assets/images/icon-exchange-vertical.svg?react';
import { Button } from '@/components/ui/button.tsx';

interface SwapButtonProps {
  onSwap: () => void;
}

export function SwapButton({ onSwap }: SwapButtonProps) {
  return (
    <Button variant="secondary" aria-label="Swap currencies" onClick={onSwap} className="size-12">
      <SwapIcon />
    </Button>
  );
}
