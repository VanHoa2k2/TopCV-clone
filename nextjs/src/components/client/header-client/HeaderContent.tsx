"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import TopCVLogo from "@/assets/images/topcv-logo-6.webp";
import Image from "next/image";
import { Button } from "../../ui/button";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { IoIosChatbubbles } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import { FaBell } from "react-icons/fa";
import { FiChevronsRight } from "react-icons/fi";
import { RxDividerVertical } from "react-icons/rx";
import { FiLogOut } from "react-icons/fi";
import { Avatar, message, Tooltip } from "antd";
import AvatarDefault from "@/assets/avatar/avatar-default.jpg";
import NoNotification from "@/assets/images/no-notification-image.jpg";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { FormOutlined } from "@ant-design/icons";
import authApiRequest from "@/apiRequests/auth";
import { setLogoutAction } from "@/redux/slice/accountSlide";
import { usePathname } from "next/navigation";
import userApiRequest from "@/apiRequests/user";
import { IUser } from "@/types/backend";
dayjs.extend(relativeTime);

const HeaderContent = () => {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const route = useRouter();
  const userAccount = useAppSelector((state) => state?.account?.user);
  const isAuthenticated = useAppSelector(
    (state) => state?.account?.isAuthenticated
  );
  const [user, setUser] = useState<IUser | undefined>(undefined);
  useEffect(() => {
    if (isAuthenticated) {
      const fetchUser = async () => {
        const res = await userApiRequest.callFetchUserById(
          userAccount?.id as number
        );
        setUser(res?.data);
      };

      fetchUser();
    }
  }, [userAccount?.id, isAuthenticated]);

  const notifies = user?.notifies;

  const reverseNotifies = notifies ? [...notifies].reverse() : [];
  const notifiesBadge = reverseNotifies.filter((item) => {
    return item.isActive === true;
  });

  const [isOpenNotifyTooltip, setIsOpenNotifyTooltip] =
    useState<boolean>(false);
  const [isOpenChatTooltip, setIsOpenChatTooltip] = useState<boolean>(false);

  const items = [
    {
      label: "Việc làm",
      value: "/job",
    },
    {
      label: "Hồ sơ & CV",
      value: "/manage-cv",
    },
    {
      label: "Công ty",
      value: "/company",
    },
  ];

  // const handleViewDetailJob = async (item: any) => {
  //   const slug = convertSlug(item.nameJob);
  //   route.push(`/home/job/${slug}?id=${item.jobId}`);
  //   setIsOpenTooltip(false);
  //   const res = await callUpdateNotify(item.id, !item.isActive);
  //   if (res?.statusCode === 200) {
  //     fetchUserInfo();
  //   }
  // };

  const handleLogout = async () => {
    const res = await authApiRequest.logoutFromNextClientToNextServer();
    if (res && res.data) {
      dispatch(setLogoutAction({}));
      message.success("Đăng xuất thành công");
    }
  };

  const notifications = (
    <div className="w-[300px] text-[#212f3f]">
      <div className="text-[18px] font-semibold leading-[24px] border-b border-[#f4f5f5] p-[12px]">
        Thông báo
      </div>
      <div className="border-t border-b border-[#d9d9d9] max-h-[320px] overflow-y-auto overflow-x-hidden">
        <ul>
          {reverseNotifies.length > 0 ? (
            reverseNotifies?.map((item) => {
              return (
                <li
                  key={item.id}
                  className="border-b border-[#f4f5f5] p-[10px] text-[14px] text-[#212f3f] hover:text-[#00b14f] cursor-pointer"
                  // onClick={() => handleViewDetailJob(item)}
                >
                  <div className="font-semibold">{item.title}</div>
                  <div>{item.description}</div>
                  <div className="text-[#555] text-[12px]">
                    {dayjs(item.createdAt).format("DD/MM/YYYY")}
                  </div>
                </li>
              );
            })
          ) : (
            <Image
              src={NoNotification}
              alt="No notification yet"
              width={200}
              height={200}
              className="w-full object-cover"
              unoptimized
            />
          )}
        </ul>
      </div>
    </div>
  );

  const text = <span>Chức năng chưa được phát triễn</span>;

  const menuAccount = (
    <div className="bg-white py-[10px] px-2 border-0 border-white">
      <div className="flex gap-4 relative mb-6">
        <Avatar
          size={32}
          src={
            <Image
              alt="avatar"
              width={32}
              height={32}
              src={
                userAccount?.avatar
                  ? `${process.env.NEXT_PUBLIC_URL_BACKEND}/images/avatar/${userAccount?.avatar}`
                  : AvatarDefault
              }
            />
          }
        ></Avatar>
        <div className="pb-[6px]">
          <p className="text-primary font-semibold">{userAccount?.name}</p>
          <p className="text-xs text-[#6f7882] font-normal">
            {userAccount?.email}
          </p>
        </div>

        <span className="absolute bottom-[-12px] h-[1px] bg-[#e9eaec] w-full mb-1"></span>
      </div>

      <div className="bg-[#f4f5f5] rounded-[6px] min-w-[300px] my-2">
        <Link
          href="/personal-info"
          className="flex items-center text-[#212f3f] text-sm font-medium px-[10px] py-[14px] hover:text-primary"
        >
          <span className="text-[#00b14f] pr-4 w-[30px] text-[15px]">
            <FormOutlined />
          </span>
          Cài đặt thông tin cá nhân
        </Link>
      </div>
      <div className="bg-[#f4f5f5] rounded-[6px] min-w-[300px] my-2">
        <div
          onClick={() => handleLogout()}
          className="flex items-center text-[#e74c3c] text-sm font-medium px-[10px] py-[14px] hover:text-primary cursor-pointer"
        >
          <span className="text-[#00b14f] pr-4 w-[30px] text-[15px]">
            <FiLogOut />
          </span>
          Đăng xuất
        </div>
      </div>
    </div>
  );
  return (
    <>
      <div className="flex">
        <Link href="/" className="pr-5">
          <Image src={TopCVLogo} alt="TopCV" width={176} height={72} />
        </Link>

        <div className="flex">
          {items.map((item, index) => (
            <Link
              href={item.value}
              key={index}
              className={`px-[15px] py-3 mx-[5px] my-[14px] font-semibold hover:text-primary ${
                pathname.slice(1) === item.value ? "text-primary" : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex gap-3 items-center">
        {isAuthenticated === false ? (
          <>
            <Button
              size={"lg"}
              className="bg-white text-primary border border-solid border-primary hover:bg-[#e5f7ed80]"
              onClick={() => route.push("/login")}
            >
              Đăng nhập
            </Button>
            <Button size={"lg"} onClick={() => route.push("/register")}>
              Đăng ký
            </Button>
            <Button
              size={"lg"}
              className="bg-dark rounded hover:bg-[#161f29]"
              onClick={() => route.push("/login-for-hr")}
            >
              Đăng tuyển & tìm hồ sơ
            </Button>
          </>
        ) : (
          <>
            <div className="flex flex-col gap-1">
              <p className="text-[#7f878f] text-[12px] leading-[14px] font-normal">
                Bạn là nhà tuyển dụng?
              </p>
              <Link
                href="/login-for-hr"
                className="text-[#263a4d] text-sm leading-[22px] font-semibold flex hover:text-primary"
              >
                Đăng tuyển ngay <FiChevronsRight className="w-5 h-5" />
              </Link>
            </div>

            <RxDividerVertical className="h-[48px] w-[34px] text-[#e6e7e8] opacity-55 mx-[-12px]" />

            <Tooltip
              placement="bottom"
              title={notifications}
              arrow={false}
              trigger="click"
              color="#fff"
              overlayStyle={{ maxWidth: "400px" }}
              open={isOpenNotifyTooltip}
              onOpenChange={() => setIsOpenNotifyTooltip(false)}
            >
              <div
                className="bg-[#00b14f1a] rounded-full cursor-pointer relative"
                onClick={() => setIsOpenNotifyTooltip(!isOpenNotifyTooltip)}
              >
                <FaBell
                  className="w-10 h-10 p-[10px] text-primary"
                  type="button"
                  onMouseEnter={() => {}}
                  onMouseLeave={() => {}}
                />
                {notifiesBadge?.length > 0 && (
                  <span className="absolute top-[-32%] right-[-40%] w-[18px] h-[18px] bg-[#f4eaea] opacity-80 text-[#393838] rounded-full flex items-center justify-center text-[12px] font-semibold z-10">
                    {notifiesBadge?.length}
                  </span>
                )}
              </div>
            </Tooltip>

            <Tooltip
              placement="bottom"
              title={text}
              trigger="click"
              open={isOpenChatTooltip}
              onOpenChange={() => setIsOpenChatTooltip(false)}
            >
              <div
                className="bg-[#00b14f1a] rounded-full cursor-pointer"
                onClick={() => setIsOpenChatTooltip(!isOpenChatTooltip)}
              >
                <IoIosChatbubbles
                  className="w-10 h-10 p-2 text-primary"
                  type="button"
                  onMouseEnter={() => {}}
                  onMouseLeave={() => {}}
                />
              </div>
            </Tooltip>

            <Tooltip
              placement="bottom"
              title={menuAccount}
              arrow={false}
              color="#fff"
              overlayStyle={{ maxWidth: "360px" }}
              getPopupContainer={(triggerNode: any) => triggerNode.parentNode}
            >
              <div className="flex gap-[6px] items-center cursor-pointer group">
                <Avatar
                  size={32}
                  src={
                    <Image
                      alt="avatar"
                      width={32}
                      height={32}
                      src={
                        userAccount?.avatar
                          ? `${process.env.NEXT_PUBLIC_URL_BACKEND}/images/avatar/${userAccount?.avatar}`
                          : AvatarDefault
                      }
                    />
                  }
                ></Avatar>

                <span className="w-5 text-primary transform transition-transform duration-300 group-hover:rotate-180">
                  <IoIosArrowDown />
                </span>
              </div>
            </Tooltip>
          </>
        )}
      </div>
    </>
  );
};

export default HeaderContent;
