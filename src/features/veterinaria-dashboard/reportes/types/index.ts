export type ExportDataResponse = {
  data: Blob;
  filename: string;
}

export type ExportParams = {
  duenoId?: string;
}

export type ExportError = {
  message: string;
  status: number;
}