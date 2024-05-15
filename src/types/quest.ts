export type TCurrentItem = {
  display: string;
  index: number | null;
};

export type StringListState = {
  strings: string[];
  selectedStrings: string[];
};

export type TAppTitle = {
  mainTitle: string;
  subTitle: string;
};

export interface IQuest {
  _id: string;
  selected: boolean;
  name: string;
  isUsed?: boolean;
}

export type TQuestRequest = {
  name: string;
  selected: boolean;
};

export interface StringSpinnerProps {
  strings: IQuest[];
  interval?: number;
}

export interface IConfig {
  drawCount: number;
  selectedStrings: IQuest[];
}
