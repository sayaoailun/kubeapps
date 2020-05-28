import { APIBase } from "./Kube";
import { IServiceBroker } from "./ServiceCatalog";
import { IChartVersion } from "./types";

export const app = {
  charts: {
    version: (cv: IChartVersion) =>
      `/charts/${cv.relationships.chart.data.repo.name}/${cv.relationships.chart.data.name}/versions/${cv.attributes.version}`,
  },
  operators: {
    view: (namespace: string, name: string) => `/ns/${namespace}/operators/${name}`,
    list: (namespace: string) => `/ns/${namespace}/operators`,
    new: (namespace: string, name: string) => `/ns/${namespace}/operators/new/${name}`,
  },
  operatorInstances: {
    update: (namespace: string, csvName: string, crdName: string, instanceName: string) =>
      `/ns/${namespace}/operators-instances/${csvName}/${crdName}/${instanceName}/update`,
  },
};

function withNS(namespace: string) {
  return namespace === "_all" ? "" : `namespaces/${namespace}/`;
}

export const backend = {
  apprepositories: {
    base: (namespace: string) => `api/v1/namespaces/${namespace}/apprepositories`,
    create: (namespace: string) => backend.apprepositories.base(namespace),
    validate: () => `${backend.apprepositories.base("kubeapps")}/validate`,
    delete: (name: string, namespace: string) =>
      `${backend.apprepositories.base(namespace)}/${name}`,
    update: (namespace: string, name: string) =>
      `${backend.apprepositories.base(namespace)}/${name}`,
  },
  namespaces: {
    base: "api/v1/namespaces",
    list: () => `${backend.namespaces.base}`,
  },
};

export const api = {
  apprepostories: {
    base: `${APIBase}/apis/kubeapps.com/v1alpha1`,
    create: (namespace: string) =>
      `${api.apprepostories.base}/namespaces/${namespace}/apprepositories`,
  },

  charts: {
    base: "api/assetsvc/v1",
    get: (namespace: string, id: string) => `${api.charts.base}/ns/${namespace}/charts/${id}`,
    getReadme: (namespace: string, id: string, version: string) =>
      `${api.charts.base}/ns/${namespace}/assets/${id}/versions/${encodeURIComponent(
        version,
      )}/README.md`,
    getValues: (namespace: string, id: string, version: string) =>
      `${api.charts.base}/ns/${namespace}/assets/${id}/versions/${encodeURIComponent(
        version,
      )}/values.yaml`,
    getSchema: (namespace: string, id: string, version: string) =>
      `${api.charts.base}/ns/${namespace}/assets/${id}/versions/${encodeURIComponent(
        version,
      )}/values.schema.json`,
    getVersion: (namespace: string, id: string, version: string) =>
      `${api.charts.base}/ns/${namespace}/charts/${id}/versions/${encodeURIComponent(version)}`,
    list: (namespace: string, repo?: string) =>
      `${api.charts.base}/ns/${namespace}/charts${repo ? `/${repo}` : ""}`,
    listVersions: (namespace: string, id: string) => `${api.charts.get(namespace, id)}/versions`,
  },

  serviceinstances: {
    base: `${APIBase}/apis/servicecatalog.k8s.io/v1beta1`,
    create: (namespace: string) =>
      `${api.serviceinstances.base}/namespaces/${namespace}/serviceinstances`,
  },

  clusterservicebrokers: {
    base: `${APIBase}/apis/servicecatalog.k8s.io/v1beta1`,
    sync: (broker: IServiceBroker) =>
      `${api.clusterservicebrokers.base}/clusterservicebrokers/${broker.metadata.name}`,
  },

  operators: {
    operators: (namespace: string) =>
      `${APIBase}/apis/packages.operators.coreos.com/v1/${withNS(namespace)}packagemanifests`,
    operator: (namespace: string, name: string) =>
      `${APIBase}/apis/packages.operators.coreos.com/v1/namespaces/${namespace}/packagemanifests/${name}`,
    clusterServiceVersions: (namespace: string) =>
      `${APIBase}/apis/operators.coreos.com/v1alpha1/${withNS(namespace)}clusterserviceversions`,
    clusterServiceVersion: (namespace: string, name: string) =>
      `${APIBase}/apis/operators.coreos.com/v1alpha1/namespaces/${namespace}/clusterserviceversions/${name}`,
    operatorIcon: (namespace: string, name: string) =>
      `api/v1/namespaces/${namespace}/operator/${name}/logo`,
    resources: (namespace: string, apiVersion: string, resource: string) =>
      `${APIBase}/apis/${apiVersion}/${withNS(namespace)}${resource}`,
    resource: (namespace: string, apiVersion: string, resource: string, name: string) =>
      `${APIBase}/apis/${apiVersion}/namespaces/${namespace}/${resource}/${name}`,
    operatorGroups: (namespace: string) =>
      `${APIBase}/apis/operators.coreos.com/v1/namespaces/${namespace}/operatorgroups`,
    subscription: (namespace: string, name: string) =>
      `${APIBase}/apis/operators.coreos.com/v1alpha1/namespaces/${namespace}/subscriptions/${name}`,
  },
};
