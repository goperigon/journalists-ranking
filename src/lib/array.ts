import { ListIterateeCustom } from "lodash";
import findIndex from "lodash/findIndex";
import merge from "lodash/merge";

// Function to add or update an item in an array
export function addOrUpdateArray(
  array: any[],
  newItem: any,
  predicate: ListIterateeCustom<any, boolean>
) {
  const index = findIndex(array, predicate);

  if (index === -1) {
    // Item not found, add it to the array
    array.push(newItem);
  } else {
    // Item found, update it
    array[index] = merge(array[index], newItem);
  }

  return array;
}
