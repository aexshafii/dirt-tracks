import { types } from '../types/types';

export type ChipProps = {
  type: (typeof types)[number];
  showBorder?: boolean;
  onClick?: () => void;
};

export const Chip = ({ type, showBorder = false }: ChipProps) => {
  let color: string;
  let backgroundColor: string;
  let border: string;

  switch (type) {
    case 'mixed track':
      color = 'text-blue-11';
      backgroundColor = 'bg-blue-3';
      border = 'border border-blue-5';
      break;
    case 'dirt track':
      color = 'text-amber-11';
      backgroundColor = 'bg-amber-3';
      border = 'border border-amber-5';
      break;
    // case 'restaurant':
    //   color = 'text-teal-11';
    //   backgroundColor = 'bg-teal-3';
    //   border = 'border border-teal-5';
    //   break;
    // case 'coffee':
    //   color = 'text-bronze-11';
    //   backgroundColor = 'bg-bronze-3';
    //   border = 'border border-bronze-5';
    //   break;
    default:
      color = 'text-blue-11';
      backgroundColor = 'bg-blue-3';
      border = 'border border-blue-5';
      break;
  }

  return (
    <div
      className={`rounded-full ${
        showBorder ? border : ''
      }  p-1.5 w-fit flex justify-center items-center text-sm tracking-tighter font-[450] py-1 px-2 ${color} ${backgroundColor}`}
    >
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </div>
  );
};
