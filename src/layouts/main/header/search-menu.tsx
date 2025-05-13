import {
  PiFileDuotone,
  PiHouseDuotone,
  PiSquaresFourDuotone,
  PiMagnifyingGlassBold as SearchIcon,
} from 'react-icons/pi';
import { Spotlight, SpotlightActionData } from '@mantine/spotlight';

const actions: SpotlightActionData[] = [
  {
    id: 'home',
    label: 'Home',
    description: 'Get to home page',
    onClick: () => console.log('Home'),
    leftSection: <PiHouseDuotone size="1.5rem" />,
  },
];

export function SearchMenu() {
  return (
    <Spotlight
      actions={actions}
      nothingFound="Nothing found..."
      highlightQuery
      searchProps={{
        leftSection: <SearchIcon />,
        placeholder: 'Search feature',
      }}
    />
  );
}
