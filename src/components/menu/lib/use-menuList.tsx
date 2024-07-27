import { useEffect, useState } from "react";
import { useAuth } from "@/app/providers/auth-provider";
import { Roles, classMaterialURL } from "@/shared/constants/global";

import { ModalPurchase } from "@/components/modal-purchase";
import { Info } from "@/components/refer-banner/ui/info";
import { FaRegCalendarAlt } from "react-icons/fa";
import { FaGraduationCap } from "react-icons/fa6";
import { GoHomeFill } from "react-icons/go";
import { IoGiftOutline } from "react-icons/io5";
import {
	MdEventNote,
	MdLibraryBooks,
	MdOutlineShoppingBag,
} from "react-icons/md";

interface MentorNavLinks {
	label: string;
	link: string;
	icon: any;
}

interface StudentNavLinks {
	label: string;
	link: string;
	type?: "trial" | "modal" | "external";
	modal?: JSX.Element;
	icon: any;
}

const mentorNavLinks: MentorNavLinks[] = [
	{
		label: "manage_appointments",
		link: "/mentor/manage-appointments",
		icon: GoHomeFill,
	},
	{
		label: "lessons",
		link: "/mentor/lesson-calendar",
		icon: FaRegCalendarAlt,
	},
	{
		label: "my_availability",
		link: "/mentor/availability",
		icon: FaRegCalendarAlt,
	},
];


const studentNavLinks: StudentNavLinks[] = [
	{
		label: "dashboard",
		link: "/student/manage-lessons",
		icon: GoHomeFill,
	},
	{
		label: "lessons",
		link: "/student/lesson-calendar",
		icon: MdEventNote,
	},
	{
		label: "mentors",
		link: "/student/mentors-list",
		icon: FaGraduationCap,
		type: "trial",
		modal: <ModalPurchase />,
	},
	{
		label: "purchase",
		link: "/student/subscriptions",
		icon: MdOutlineShoppingBag,
	},
	{
		label: "free_classes",
		link: "#",
		icon: IoGiftOutline,
		type: "modal",
		modal: <Info />,
	},
	{
		label: "class_material",
		link: classMaterialURL || "https://naonow.instructure.com/",
		icon: MdLibraryBooks,
		type: "external",
	},
];

export const useMenuList = () => {
	const { user } = useAuth();
	const [navLinks, setNavLinks] = useState<MentorNavLinks[] | StudentNavLinks[]>([]);

	useEffect(() => {
		if (user?.role === Roles.MENTOR) {
			setNavLinks(mentorNavLinks);
		} else if (user?.role === Roles.STUDENT) {
			setNavLinks(studentNavLinks);
		}
	}, [user]);

	return navLinks;
};
