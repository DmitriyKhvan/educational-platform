import MyDropdownMenu from "@/components/dropdown-menu";
import Button from "@/components/form/button";
import CheckboxField from "@/components/form/checkbox-field";
import { UPDATE_USER } from "@/shared/apollo/mutations/user/update-user";
import notify from "@/shared/utils/notify";
import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import { useAuth } from "src/app/providers/auth-provider";
import { useCurrency } from "src/app/providers/currency-provider";
import { currenciesDic } from "src/shared/constants/global";

export const CurrencySwitcher = () => {
	const { user } = useAuth();
	const { curCurrency, setCurCurrency, setLoadingCurrency } = useCurrency();
	const [open, setOpen] = useState(false);
	const [updateUser] = useMutation(UPDATE_USER);

	const onChangeCurrency = async (currency) => {
		setLoadingCurrency(true);
		await updateUser({
			variables: {
				id: Number.parseInt(user?.id),
				data: {
					paymentCurrency: currency.value.toLowerCase(),
				},
			},
			onCompleted: () => {
				setOpen(false);
				setCurCurrency(currency);
				localStorage.setItem("currency", currency.value);
			},
			onError: (error) => {
				notify(error.message, "error");
			},
		});
		setLoadingCurrency(false);
	};

	return (
		<MyDropdownMenu
			open={open}
			setOpen={setOpen}
			button={
				<Button
					theme="clear"
					className="flex justify-between items-center gap-3 w-full border border-gray-200"
				>
					<span className="grow text-left">{curCurrency?.label}</span>
					{open ? <FaAngleUp /> : <FaAngleDown />}
				</Button>
			}
		>
			<ul className="w-[200px]">
				{currenciesDic
					.filter((currency) => currency.active)
					.map((currency) => {
						return (
							<li
								key={currency.value}
								className="border-b border-color-border-grey last:border-b-0"
							>
								<label className="flex items-center justify-between gap-3 p-4 cursor-pointer ">
									<span className="text-sm font-medium text-color-dark-purple">
										{currency.label}
									</span>
									<CheckboxField
										onChange={() => onChangeCurrency(currency)}
										type="radio"
										name="currency"
										checked={currency.value === curCurrency.value}
									/>
								</label>
							</li>
						);
					})}
			</ul>
		</MyDropdownMenu>
	);
};
