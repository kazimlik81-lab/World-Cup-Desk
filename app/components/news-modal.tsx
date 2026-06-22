import { Plane, X } from "lucide-react";
import type { MouseEvent, ReactElement } from "react";
import type { AppCopy } from "@/lib/localization";
import type { ChampionshipNewsItem } from "@/lib/tournament-data";
import { NewsCard } from "@/app/components/news-card";

type NewsModalProperties = {
  newsItems: ChampionshipNewsItem[];
  onClose: () => void;
  copy: AppCopy["newsModal"];
  dateLocale: string;
};

export function NewsModal(properties: NewsModalProperties): ReactElement {
  const stopModalClose = (mouseEvent: MouseEvent<HTMLElement>): void => {
    mouseEvent.stopPropagation();
  };

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={properties.onClose}>
      <section
        className="news-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-news-title"
        onMouseDown={stopModalClose}
      >
        <div className="modal-heading">
          <div>
            <p className="eyebrow">{properties.copy.eyebrow}</p>
            <h2 id="modal-news-title">{properties.copy.title}</h2>
          </div>
          <button className="icon-action" type="button" onClick={properties.onClose} aria-label={properties.copy.closeLabel}>
            <X size={19} aria-hidden="true" />
          </button>
        </div>
        <div className="modal-lead">
          <Plane size={18} aria-hidden="true" />
          <span>{properties.copy.lead}</span>
        </div>
        <div className="modal-news-list">
          {properties.newsItems.map((newsItem) => (
            <NewsCard
              key={`${newsItem.title}-${newsItem.publishedAt}`}
              newsItem={newsItem}
              dateLocale={properties.dateLocale}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
