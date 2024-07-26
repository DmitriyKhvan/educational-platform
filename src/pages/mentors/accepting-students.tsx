import Loader from "@/components/loader/loader";
import { ACCEPT_NEW_STUDENTS } from "@/shared/apollo/mutations/accept-new-students";
import notify from "@/shared/utils/notify";
import { useMutation } from "@apollo/client";
import * as Switch from "@radix-ui/react-switch";
import { useAuth } from "@/app/providers/auth-provider";

export const AcceptingStudents = () => {
	const { user, refetchUser } = useAuth();
	const [acceptNewStudents, { loading }] = useMutation(ACCEPT_NEW_STUDENTS);

	const submit = (accept) => {
		acceptNewStudents({
			variables: {
				mentorId: user.mentor.id,
				accept,
			},
			onCompleted: () => {
				refetchUser();
			},
			onError: (error) => {
				notify(error.message, "error");
			},
		});
	};

	return (
		<>
			{loading && (
				<div className="fixed top-0 left-0 bottom-0 right-0 z-[10000] flex items-center justify-center bg-black/20">
					<Loader />
				</div>
			)}

			<div className="flex">
				<div className="flex items-center gap-4 py-5 px-4 border border-gray-100 rounded-lg shadow-[0px_0px_8px_0px_rgba(0,_0,_0,_0.08)]">
					<Switch.Root
						className="w-[40px] h-[24px] bg-gray-100 shadow-[0_0_0_1px_rgba(0,_0,_0,_0.05)] rounded-full relative outline-none cursor-pointer focus:border-[hsla(210,_96%,_45%,_50%)] focus:shadow-[0_0_0_0.25rem_rgba(13,110,253,0.25)] data-[state=checked]:bg-color-purple/10"
						id="airplane-mode"
						// style={{ '-webkit-tap-highlight-color': 'rgba(0, 0, 0, 0)' }}
						defaultChecked={user.mentor.acceptingStudents}
						onCheckedChange={submit}
					>
						<Switch.Thumb className="block w-[16px] h-[16px] bg-gray-400 rounded-full transition-transform duration-100 translate-x-1 will-change-transform data-[state=checked]:translate-x-[20px] data-[state=checked]:bg-color-purple" />
					</Switch.Root>

					<label
						className="text-sm text-color-dark-purple font-medium"
						htmlFor="airplane-mode"
					>
						Accept New Students
					</label>
				</div>
			</div>
		</>
	);
};
