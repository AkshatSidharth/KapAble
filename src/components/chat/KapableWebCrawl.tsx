import type React from "react";
import type { ReactNode } from "react";
import { ScanQrCode } from "lucide-react";
import { KapableCard, KapableCardHeader, KapableBadge } from "./KapableCardPrimitives";

interface KapableWebCrawlProps {
  children?: ReactNode;
  node?: any;
}

export const KapableWebCrawl: React.FC<KapableWebCrawlProps> = ({
  children,
  node: _node,
}) => {
  return (
    <KapableCard accentColor="blue">
      <KapableCardHeader icon={<ScanQrCode size={15} />} accentColor="blue">
        <KapableBadge color="blue">Web Crawl</KapableBadge>
      </KapableCardHeader>
      {children && (
        <div className="px-3 pb-2 text-sm italic text-muted-foreground">
          {children}
        </div>
      )}
    </KapableCard>
  );
};
