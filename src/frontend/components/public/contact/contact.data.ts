/**
 * Editable contact details for the Contact page.
 * Replace each social href with the real profile URL.
 */

import type { IconType } from "react-icons";
import {
  FaBehance,
  FaInstagram,
  FaLinkedinIn,
  FaPinterestP,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";
import { SiGooglescholar } from "react-icons/si";

export const contactDetails = {
  email: "swatiajaykulkarni@gmail.com",
  location: "Pune, India",
  availability: "Open to commissions, exhibitions and workshops",
};

export interface SocialLink {
  name: string;
  handle: string;
  href: string;
  icon: IconType;
}

export const socialLinks: SocialLink[] = [
  {
    name: "Instagram",
    handle: "@swatiajaykulkarni",
    href: "https://instagram.com",
    icon: FaInstagram,
  },
  {
    name: "Pinterest",
    handle: "Moodboards & studies",
    href: "https://pinterest.com",
    icon: FaPinterestP,
  },
  {
    name: "Behance",
    handle: "Project archive",
    href: "https://behance.net",
    icon: FaBehance,
  },
  {
    name: "YouTube",
    handle: "Process & field journals",
    href: "https://youtube.com",
    icon: FaYoutube,
  },
  {
    name: "LinkedIn",
    handle: "Dean of Student Affairs, AIT Pune",
    href: "https://in.linkedin.com/in/dr-swati-ajay-kulkarni-081a908",
    icon: FaLinkedinIn,
  },
  {
    name: "Google Scholar",
    handle: "Research & publications",
    href: "https://scholar.google.com/citations?user=OyEZ5r4AAAAJ&hl=en",
    icon: SiGooglescholar,
  },
  {
    name: "X",
    handle: "Studio updates",
    href: "https://x.com",
    icon: FaXTwitter,
  },
];
