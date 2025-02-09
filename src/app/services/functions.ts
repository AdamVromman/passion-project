import { SelectableDataType } from "./types";

export const dataTypeAndDataToString = (
  type: SelectableDataType,
  data?: number
) => {
  let localData;
  if (data !== undefined) {
    localData = Intl.NumberFormat("en-US").format(data);
  }

  switch (type) {
    case SelectableDataType.ADULTS_IMPRISONED:
      return `${localData ?? ""}${localData ? " a" : "A"}dult${
        data === 1 ? "" : "s"
      } imprisoned`;
    case SelectableDataType.ADULTS_INJURED:
      return `${localData ?? ""}${localData ? " a" : "A"}dult${
        data === 1 ? "" : "s"
      } injured`;
    case SelectableDataType.ADULTS_KILLED:
      return `${localData ?? ""}${localData ? " a" : "A"}dult${
        data === 1 ? "" : "s"
      } killed`;
    case SelectableDataType.MINORS_IMPRISONED:
      return `${localData ?? ""}${localData ? " m" : "M"}inor${
        data === 1 ? "" : "s"
      } imprisoned`;
    case SelectableDataType.MINORS_INJURED:
      return `${localData ?? ""}${localData ? " m" : "M"}inor${
        data === 1 ? "" : "s"
      } injured`;
    case SelectableDataType.MINORS_KILLED:
      return `${localData ?? ""}${localData ? " m" : "M"}inor${
        data === 1 ? "" : "s"
      } killed`;
    case SelectableDataType.BUILDINGS_DEMOLISHED:
      return `${localData ?? ""}${localData ? " b" : "B"}uilding${
        data === 1 ? "" : "s"
      } demolished`;
    case SelectableDataType.PALESTINIANS_DISPLACED:
      return `${localData ?? ""}${localData ? " P" : "P"}alestinian${
        data === 1 ? "" : "s"
      } displaced`;
    case SelectableDataType.ILLEGAL_SETTLERS:
      return `${localData ?? ""}${localData ? " i" : "I"}llegal settler${
        data === 1 ? "" : "s"
      }`;
    case SelectableDataType.PERCENTAGE_OF_PALESTINIAN_LAND_STOLEN:
      return `${
        localData ? `${localData}%` : "Percentage"
      } of Palestinian land stolen`;
  }
};

export const dataAndTypeToStringEye = (amount: number, type: string) => {
  switch (type) {
    case "gazaKilled":
      return `${amount} ${amount === 1 ? "person" : "people"} killed in Gaza`;
    case "gazaInjured":
      return `${amount} ${amount === 1 ? "person" : "people"} injured in Gaza`;
    case "westBankKilled":
      return `${amount} ${
        amount === 1 ? "person" : "people"
      } killed in the West Bank`;
    case "westBankInjured":
      return `${amount} ${
        amount === 1 ? "person" : "people"
      } injured in the West Bank`;
  }
};
