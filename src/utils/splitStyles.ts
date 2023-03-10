import type { ViewStyle } from 'react-native';

type Tuple = readonly ((style: string) => boolean)[];

type MappedTuple<T extends Tuple> = {
  [Index in keyof T]: ViewStyle;
} & { length: T['length'] };

export function splitStyles<T extends Tuple>(styles: ViewStyle, ...filters: T) {
  const newStyles = filters.map<[string, ViewStyle][]>(returnEmptyArray);

  // Rest styles
  newStyles.push([]);

  outer: for (const item of Object.entries(styles) as [string, ViewStyle][]) {
    for (let i = 0; i < filters.length; i++) {
      if (filters[i](item[0])) {
        newStyles[i].push(item);
        continue outer;
      }
    }

    // Adds to rest styles if not filtered
    newStyles[filters.length].push(item);
  }

  // Put rest styles in the beginning
  const last = newStyles.pop()!;
  newStyles.unshift(last);

  return newStyles.map((styles) => Object.fromEntries(styles)) as unknown as [
    ViewStyle,
    ...MappedTuple<T>
  ];
}

function returnEmptyArray<T extends unknown[]>() {
  return [] as unknown as T;
}
