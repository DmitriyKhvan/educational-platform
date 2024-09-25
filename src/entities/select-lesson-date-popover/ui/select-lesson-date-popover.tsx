// import MyDropdownMenu from "@/components/dropdown-menu";
// import Button from "@/components/form/button";
// import CheckboxField from "@/components/form/checkbox-field";
// import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
// import { FaAngleDown } from "react-icons/fa6";

// function SelectLessonDatePopover({date}) {
//   return (<Popover
//     open={date}
//   >
//     <PopoverTrigger asChild>
//       <button
//         type="button"
//         onClick={() => {
//           setChosenDates([eventInfo?.event?._instance?.range?.start?.toISOString()]);
//           setRepeatWeekly(false);
//           setRepeatPeriod(1);
//         }}
//         className={cn(
//           'w-full focus:bg-opacity-100 focus:text-white bg-color-banner-green rounded bg-opacity-10 text-color-banner-green py-2',
//           chosenDates.includes(eventInfo?.event?._instance?.range?.start?.toISOString()) &&
//             'bg-opacity-100 text-white',
//         )}
//       >
//         {eventInfo?.event?.title ?? '10:00-10:30'}
//       </button>
//     </PopoverTrigger>
//     <PopoverContent
//       className="w-[300px] bg-white"
//       side="left"
//       sideOffset={10}
//       avoidCollisions={true}
//     >
//       <div className="grid gap-4">
//         <div className="space-y-3 mb-1">
//           <h4 className="font-semibold leading-none">Friday, June 8th</h4>
//           <p className="text-sm text-muted-foreground">10:00 – 10:25</p>
//         </div>
//         <div className="grid gap-2 mb-4">
//           <label className="flex items-center gap-3 mb-4">
//             <CheckboxField
//               square
//               checked={repeatWeekly}
//               onChange={(e) => setRepeatWeekly(e.target.checked)}
//             />
//             {/* <input
//               type="checkbox"
//               checked={repeatWeekly}
//               onChange={(e) => setRepeatWeekly(e.target.checked)}
//             /> */}
//             Repeat weekly
//           </label>

//           {repeatWeekly && (
//             // <SelectField
//             // 	// value={value}
//             // 	options={testValues}
//             // 	// onChange={onChange}
//             // />
//             <MyDropdownMenu
//               // open={open}
//               // setOpen={setOpen}
//               contentClassName="z-50 w-full"
//               button={
//                 <Button
//                   theme="clear"
//                   className={
//                     'flex justify-between items-center gap-3 w-full border border-gray-200'
//                   }
//                 >
//                   {/* <VscGlobe className="text-2xl" /> */}
//                   <span className="grow text-left">For 1 month</span>
//                   <FaAngleDown />
//                 </Button>
//               }
//             >
//               {/* <ul className="w-[calc(100vw-2*24px)] sm:w-[514px]"> */}
//               <ul className={'w-[252px] z-50'}>
//                 <li
//                   key={'1month'}
//                   className={'border-b border-color-border-grey last:border-b-0'}
//                 >
//                   <label className="flex items-center justify-between gap-3 p-4 cursor-pointer ">
//                     <span className={'text-sm font-medium text-color-dark-purple'}>
//                       {/* {t(lang.label)} */}
//                       For 1 month
//                     </span>
//                     <CheckboxField
//                       onChange={() => setRepeatPeriod(1)}
//                       type="radio"
//                       name="period"
//                       checked={repeatPeriod === 1}
//                     />
//                   </label>
//                 </li>
//                 <li
//                   key={'3month'}
//                   className={'border-b border-color-border-grey last:border-b-0'}
//                 >
//                   <label className="flex items-center justify-between gap-3 p-4 cursor-pointer ">
//                     <span className={'text-sm font-medium text-color-dark-purple'}>
//                       {/* {t(lang.label)} */}
//                       For 3 months
//                     </span>
//                     <CheckboxField
//                       onChange={() => setRepeatPeriod(3)}
//                       type="radio"
//                       name="period"
//                       checked={repeatPeriod === 3}
//                     />
//                   </label>
//                 </li>
//               </ul>
//             </MyDropdownMenu>
//           )}
//           {/* <Button theme="gray">
//             <BiTrash />
//             Delete time-slot
//           </Button> */}
//         </div>
//       </div>
//     </PopoverContent>
//   </Popover>)
// }

// export default SelectLessonDatePopover
