import { XCircleIcon } from "@heroicons/react/24/solid";

type Props = {
  title: string;
  subtitle: string;
  removeHandler: () => void;
};

const Card = ({ title, subtitle, removeHandler }: Props) => {
  return (
    <li className="relative space-y-4 rounded border bg-white p-4">
      <div>
        <button
          onClick={removeHandler}
          type="button"
          className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2">
          <XCircleIcon className="h-6 w-6" />
        </button>
        <h4 className="font-semibold">{title}</h4>
        <h5 className="text-xs text-primary-dark/fade">{subtitle}</h5>
      </div>
    </li>
  );
};

export default Card;
