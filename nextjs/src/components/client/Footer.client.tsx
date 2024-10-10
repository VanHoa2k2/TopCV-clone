import Image from "next/image";
import Link from "next/link";
import React from "react";
import TopCVLogo from "@/assets/images/topcv-logo-6.webp";
import googleStartup from "@/assets/images/google_for_startup.webp";
import DMCA from "@/assets/images/DMCA_badge_grn_60w.png";
import blt from "@/assets/images/bct.webp";
import AppStore from "@/assets/images/app_store.webp";
import GoogPlay from "@/assets/images/chplay.webp";
import Facebook from "@/assets/icons/facebook.webp";
import Youtube from "@/assets/icons/youtube.webp";
import Tiktok from "@/assets/icons/tiktok.webp";
import Linked from "@/assets/icons/linkedin.webp";
import {
  aboutLinks,
  careerLinks,
  discoverLinks,
  partnerLinks,
  personalDevelopmentLinks,
  profileAndCVLinks,
} from "@/lib/utils";
import LinkGroup from "../share/LinkGroup";

const Footer = () => {
  return (
    <div className="leading-none border-t border-[#e9e4e4]">
      <div className="container py-10">
        <div className="flex justify-between gap-[15px]">
          <div>
            <Link href="/">
              <Image
                src={TopCVLogo}
                alt="TopCVLogo"
                width={327}
                height={128}
                className="object-contain mb-4"
              />
            </Link>

            <div className="flex justify-between mb-8">
              <Image
                src={googleStartup}
                alt="googleStartup"
                width={145}
                height={40}
                className="object-contain"
              />

              <Link
                href="https://www.dmca.com/Protection/Status.aspx?ID=8be40718-7da1-4b43-875a-3efb819100c9&refurl=https://www.topcv.vn/?ref=you"
                target="_blank"
              >
                <Image
                  src={DMCA}
                  alt="DMCA"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </Link>
              <Link
                href="http://online.gov.vn/Home/WebDetails/25388"
                target="_blank"
              >
                <Image
                  src={blt}
                  alt="blt"
                  width={95}
                  height={36}
                  className="object-contain"
                />
              </Link>
            </div>

            <div className="mb-7">
              <p className="text-[#212f3f] text-base font-semibold mb-3">
                Liên hệ
              </p>
              <p className="text-[#6f7882] text-sm font-normal mr-1">
                Hotline:
                <span className="text-[#212f3f] text-base font-semibold ml-1">
                  (024) 6680 5588 (Giờ hành chính)
                </span>
              </p>
              <p className="text-[#6f7882] text-sm font-normal mr-1">
                Email:
                <span className="text-[#212f3f] text-base font-semibold ml-1">
                  hotro@topcv.vn
                </span>
              </p>
            </div>

            <div className="mb-10">
              <p className="text-[#212f3f] text-base font-semibold mb-5">
                Ứng dụng tải xuống
              </p>
              <div className="flex gap-3">
                <Image
                  src={AppStore}
                  alt="appStore"
                  width={150}
                  height={44}
                  className="object-contain"
                />
                <Image
                  src={GoogPlay}
                  alt="GoogPlay"
                  width={150}
                  height={44}
                  className="object-contain"
                />
              </div>
            </div>
            <div>
              <p className="text-[#212f3f] text-base font-semibold mb-5">
                Cộng đồng TopCV
              </p>
              <div className="flex gap-3">
                <Link href="https://www.facebook.com/topcvbiz/" target="_blank">
                  <Image
                    src={Facebook}
                    alt="Facebook"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </Link>
                <Link href="https://www.youtube.com/c/TopCVpro" target="_blank">
                  <Image
                    src={Youtube}
                    alt="Youtube"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </Link>
                <Link
                  href="https://www.linkedin.com/company/topcv-vietnam"
                  target="_blank"
                >
                  <Image
                    src={Linked}
                    alt="Linked"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </Link>
                <Link href="https://www.tiktok.com/@topcv" target="_blank">
                  <Image
                    src={Tiktok}
                    alt="Tiktok"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </Link>
              </div>
            </div>
          </div>
          <div>
            <LinkGroup title="Về TopCV" links={aboutLinks} />
            <LinkGroup title="Đối tác" links={partnerLinks} />
          </div>
          <div>
            <LinkGroup title="Hồ sơ và CV" links={profileAndCVLinks} />
            <LinkGroup title="Khám phá" links={discoverLinks} />
          </div>
          <div>
            <LinkGroup title="Xây dựng sự nghiệp" links={careerLinks} />
            <LinkGroup
              title="Phát triển bản thân"
              links={personalDevelopmentLinks}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
