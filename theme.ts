import { createTheme, MantineColorsTuple } from '@mantine/core';


const paleBlue: MantineColorsTuple = [
  "#ecf3ff",
  "#dae3f7",
  "#b4c5e7",
  "#8ca5d8",
  "#6a8acb",
  "#5378c4",
  "#4770c1",
  "#385fab",
  "#2f5499",
  "#21488a"
];

const paleRed: MantineColorsTuple = [
  '#ffeded',
  '#f7dbdb',
  '#e7b5b5',
  '#d88c8c',
  '#cb6a69',
  '#c45353',
  '#c14747',
  '#ab3838',
  '#983031',
  '#882629'
];

const mutedPurple: MantineColorsTuple = [
  "#f5f1f9",
  "#e5e0ec",
  "#cbbdd9",
  "#b098c7",
  "#9878b7",
  "#8963ae",
  "#8259ab",
  "#704a96",
  "#644186",
  "#573776"
];

const paleGreen: MantineColorsTuple = [
  '#ebffef',
  '#d4fedd',
  '#a4fdb7',
  '#70fe8d',
  '#4dfe6b',
  '#3bfe55',
  '#33fe4a',
  '#28e23b',
  '#1cc833',
  '#00ad27'
];

const palePurple: MantineColorsTuple = [
  '#f7ebff',
  '#ebd1fb',
  '#d69ef9',
  '#c168f9',
  '#af3df8',
  '#a324f8',
  '#9e19f9',
  '#8a10de',
  '#7a09c5',
  '#6a00ad'
];

export const theme = createTheme({
  colors: {
    paleBlue,
    paleRed,
    mutedPurple,
    paleGreen,
    palePurple,
  }
});