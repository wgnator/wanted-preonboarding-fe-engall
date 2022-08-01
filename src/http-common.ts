import { AxiosInstance } from "axios";

export class HttpRequest {
  service: AxiosInstance;

  constructor(service: AxiosInstance) {
    this.service = service;
  }

  get(url: string) {
    return this.service.get(url);
  }

  post(url: string, data: object) {
    return this.service.post(url, data);
  }

  delete(url: string) {
    return this.service.delete(url);
  }
}
