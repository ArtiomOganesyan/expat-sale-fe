import { type ElementType, useState, useEffect, type ReactNode } from 'react';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import style from './SpeedDial.module.css';
import { LOCAL_STORAGE_KEY_LANGUAGE } from '../../../utils/constants/Item';

type FabSlotProps = NonNullable<React.ComponentProps<typeof SpeedDialAction>['slotProps']>['fab'];

export type SpeedDialActionItem = {
  name: string;
  icon: ReactNode;
  onClick?: () => void;
  fab?: FabSlotProps;
};

type BasicSpeedDialProps = {
  actions: SpeedDialActionItem[];
  Icon: ElementType;
  ariaLabel?: string;
  bottom?: number;
  right?: number;
  zIndexBoost?: number;
  sx?: React.ComponentProps<typeof SpeedDial>['sx'];
};

export default function BasicSpeedDial({
  actions = [],
  Icon,
  ariaLabel = 'SpeedDial',
  bottom = 100,
  right = 26,
  zIndexBoost = 1,
  sx,
}: BasicSpeedDialProps) {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    try {
      const chosen = !!localStorage.getItem(LOCAL_STORAGE_KEY_LANGUAGE);
      if (chosen) setVisible(false);
    } catch {
      /* noop to satisfy eslint no-empty */
    }
  }, []);

  if (!visible) return null;

  return (
    <SpeedDial
      ariaLabel={ariaLabel}
      className={style.speedDial}
      icon={<Icon />}
      onClick={() => setOpen(!open)}
      onClose={() => setOpen(false)}
      open={open}
      sx={{
        position: 'fixed',
        bottom,
        right,
        zIndex: theme => theme.zIndex.modal + zIndexBoost,
        ...sx,
      }}
    >
      {actions.map(action => (
        <SpeedDialAction
          key={action.name}
          icon={action.icon}
          onClick={() => {
            action.onClick?.();
            setOpen(false);
            setVisible(false);
          }}
          slotProps={{
            fab: action.fab,
          }}
        />
      ))}
    </SpeedDial>
  );
}
