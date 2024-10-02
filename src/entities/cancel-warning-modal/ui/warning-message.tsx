export const WarningMessage = ({
  warningMessage,
}: { warningMessage?: string | null | JSX.Element }) => {
  return (
    <div className="w-full bg-color-red bg-opacity-10 flex items-center p-4 rounded-lg">
      <span className="bg-color-red min-w-6 h-6 block rounded-full text-center text-white mr-4 text-base">
        !
      </span>
      <div className="max-w-[300px] space-y-3 font-medium text-color-dark-purple leading-5">
        <p>{warningMessage}</p>
      </div>
    </div>
  );
};
