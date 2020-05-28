import * as React from "react";
import { Link } from "react-router-dom";

import helmIcon from "../../icons/helm.svg";
import operatorIcon from "../../icons/operator-framework.svg";
import placeholder from "../../placeholder.png";
import { IRepo } from "../../shared/types";
import InfoCard from "../InfoCard";

import "./CatalogItem.css";

interface ICatalogItemProps {
  item: ICatalogItem;
}

export interface ICatalogItem {
  id: string;
  name: string;
  version: string;
  description: string;
  type: "chart" | "operator";
  namespace: string;
  icon?: string;
  repo?: IRepo;
  csv?: string;
}

// 3 lines description max
const MAX_DESC_LENGTH = 90;

function trimDescription(desc: string): string {
  if (desc.length > MAX_DESC_LENGTH) {
    // Trim to the last word under the max length
    return desc.substr(0, desc.lastIndexOf(" ", MAX_DESC_LENGTH)).concat("...");
  }
  return desc;
}

const CatalogItem: React.SFC<ICatalogItemProps> = props => {
  const { item } = props;
  const { icon, name, repo, version, description, type, namespace, id, csv } = item;
  const iconSrc = icon || placeholder;
  let link;
  let tag1;
  let subIcon;
  if (type === "chart") {
    tag1 = (
      <Link
        className="ListItem__content__info_tag_link"
        to={`/ns/${namespace}/catalog/${repo?.name}`}
      >
        {repo?.name}
      </Link>
    );
    const chartsSegment = namespace !== repo?.namespace ? "global-charts" : "charts";
    link = `/ns/${namespace}/${chartsSegment}/${repo?.name}/${name}`;
    subIcon = helmIcon;
  } else {
    // Cosmetic change, remove the version from the csv name
    const csvName = csv?.split(".v")[0];
    tag1 = <span>{csvName}</span>;
    link = `/ns/${namespace}/operators-instances/new/${csv}/${id}`;
    subIcon = operatorIcon;
  }
  const descriptionC = (
    <div className="ListItem__content__description">{trimDescription(description)}</div>
  );
  return (
    <InfoCard
      key={id}
      title={name}
      link={link}
      info={version || "-"}
      icon={iconSrc}
      description={descriptionC}
      tag1Content={tag1}
      tag1Class={repo ? repo.name : ""}
      subIcon={subIcon}
    />
  );
};

export default CatalogItem;
