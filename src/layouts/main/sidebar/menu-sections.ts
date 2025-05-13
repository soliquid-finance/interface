import { ElementType } from 'react';
import {
  PiChartLineUpDuotone,
  PiChatCenteredDotsDuotone,
  PiFilesDuotone,
  PiKanbanDuotone,
  PiLockKeyDuotone,
  PiShieldCheckDuotone,
  PiSquaresFourDuotone,
  PiStarDuotone,
  PiTableDuotone,
  PiUserPlusDuotone,
  PiUsersDuotone,
} from 'react-icons/pi';
import { paths } from '@/routes/paths';

interface MenuItem {
  header: string;
  section: {
    name: string;
    href: string;
    icon: ElementType;
    dropdownItems?: {
      name: string;
      href: string;
      badge?: string;
    }[];
  }[];
}

export const menu: MenuItem[] = [
  {
    header: 'Overview',
    section: [
    ],
  },
];
