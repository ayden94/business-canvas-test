import { Record } from '../types/Record';

export const removeDuplicateInColumnFilterArray = (array: any[], key: string) => {
  return Array.from(
    new Set(
      array
        .map((data) =>
          JSON.stringify({
            text: data[key as keyof Record],
            value: data[key as keyof Record],
          }),
        )
        .map((item) => JSON.stringify(item)),
    ),
  )
    .map((item) => {
      return JSON.parse(JSON.parse(item));
    })
    .map((item: { text: any; value: any }) => {
      return { text: String(item['text']), value: String(item['value']) };
    });
};
