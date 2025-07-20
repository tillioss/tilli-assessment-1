"use client";

import { useState, useEffect, useRef } from "react";
import {
  Phone,
  Lock,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  Search,
} from "lucide-react";
import { useAuth } from "./AuthProvider";
import Image from "next/image";

// Country codes data
const countryCodes = [
  { code: "+1", country: "US", flag: "🇺🇸" },
  { code: "+44", country: "GB", flag: "🇬🇧" },
  { code: "+91", country: "IN", flag: "🇮🇳" },
  { code: "+61", country: "AU", flag: "🇦🇺" },
  { code: "+86", country: "CN", flag: "🇨🇳" },
  { code: "+81", country: "JP", flag: "🇯🇵" },
  { code: "+49", country: "DE", flag: "🇩🇪" },
  { code: "+33", country: "FR", flag: "🇫🇷" },
  { code: "+39", country: "IT", flag: "🇮🇹" },
  { code: "+34", country: "ES", flag: "🇪🇸" },
  { code: "+7", country: "RU", flag: "🇷🇺" },
  { code: "+55", country: "BR", flag: "🇧🇷" },
  { code: "+52", country: "MX", flag: "🇲🇽" },
  { code: "+27", country: "ZA", flag: "🇿🇦" },
  { code: "+971", country: "AE", flag: "🇦🇪" },
  { code: "+966", country: "SA", flag: "🇸🇦" },
  { code: "+65", country: "SG", flag: "🇸🇬" },
  { code: "+60", country: "MY", flag: "🇲🇾" },
  { code: "+66", country: "TH", flag: "🇹🇭" },
  { code: "+84", country: "VN", flag: "🇻🇳" },
  { code: "+62", country: "ID", flag: "🇮🇩" },
  { code: "+63", country: "PH", flag: "🇵🇭" },
  { code: "+880", country: "BD", flag: "🇧🇩" },
  { code: "+92", country: "PK", flag: "🇵🇰" },
  { code: "+94", country: "LK", flag: "🇱🇰" },
  { code: "+977", country: "NP", flag: "����" },
  { code: "+95", country: "MM", flag: "🇲🇲" },
  { code: "+856", country: "LA", flag: "🇱🇦" },
  { code: "+855", country: "KH", flag: "🇰🇭" },
  { code: "+976", country: "MN", flag: "🇲🇳" },
  { code: "+992", country: "TJ", flag: "🇹🇯" },
  { code: "+996", country: "KG", flag: "🇰🇬" },
  { code: "+998", country: "UZ", flag: "🇺🇿" },
  { code: "+993", country: "TM", flag: "🇹🇲" },
  { code: "+994", country: "AZ", flag: "🇦🇿" },
  { code: "+995", country: "GE", flag: "🇬🇪" },
  { code: "+374", country: "AM", flag: "🇦🇲" },
  { code: "+375", country: "BY", flag: "🇧🇾" },
  { code: "+380", country: "UA", flag: "🇺🇦" },
  { code: "+48", country: "PL", flag: "🇵🇱" },
  { code: "+420", country: "CZ", flag: "🇨🇿" },
  { code: "+421", country: "SK", flag: "🇸🇰" },
  { code: "+36", country: "HU", flag: "🇭🇺" },
  { code: "+40", country: "RO", flag: "🇷🇴" },
  { code: "+359", country: "BG", flag: "🇧🇬" },
  { code: "+30", country: "GR", flag: "🇬🇷" },
  { code: "+385", country: "HR", flag: "🇭🇷" },
  { code: "+386", country: "SI", flag: "🇸🇮" },
  { code: "+371", country: "LV", flag: "🇱🇻" },
  { code: "+372", country: "EE", flag: "🇪🇪" },
  { code: "+370", country: "LT", flag: "🇱🇹" },
  { code: "+358", country: "FI", flag: "🇫🇮" },
  { code: "+46", country: "SE", flag: "🇸🇪" },
  { code: "+47", country: "NO", flag: "🇳🇴" },
  { code: "+45", country: "DK", flag: "🇩🇰" },
  { code: "+31", country: "NL", flag: "🇳🇱" },
  { code: "+32", country: "BE", flag: "🇧🇪" },
  { code: "+41", country: "CH", flag: "🇨🇭" },
  { code: "+43", country: "AT", flag: "🇦🇹" },
  { code: "+351", country: "PT", flag: "🇵🇹" },
  { code: "+353", country: "IE", flag: "🇮🇪" },
  { code: "+354", country: "IS", flag: "🇮🇸" },
  { code: "+356", country: "MT", flag: "🇲🇹" },
  { code: "+357", country: "CY", flag: "🇨🇾" },
  { code: "+90", country: "TR", flag: "🇹🇷" },
  { code: "+972", country: "IL", flag: "🇮🇱" },
  { code: "+962", country: "JO", flag: "🇯🇴" },
  { code: "+961", country: "LB", flag: "🇱🇧" },
  { code: "+964", country: "IQ", flag: "🇮🇶" },
  { code: "+965", country: "KW", flag: "🇰🇼" },
  { code: "+968", country: "OM", flag: "🇴🇲" },
  { code: "+973", country: "BH", flag: "🇧🇭" },
  { code: "+974", country: "QA", flag: "🇶🇦" },
  { code: "+976", country: "MN", flag: "🇲🇳" },
  { code: "+977", country: "NP", flag: "🇳🇵" },
  { code: "+880", country: "BD", flag: "🇧🇩" },
  { code: "+91", country: "IN", flag: "🇮🇳" },
  { code: "+92", country: "PK", flag: "🇵🇰" },
  { code: "+93", country: "AF", flag: "🇦🇫" },
  { code: "+94", country: "LK", flag: "🇱🇰" },
  { code: "+95", country: "MM", flag: "🇲🇲" },
  { code: "+960", country: "MV", flag: "🇲🇻" },
  { code: "+961", country: "LB", flag: "🇱🇧" },
  { code: "+962", country: "JO", flag: "🇯🇴" },
  { code: "+963", country: "SY", flag: "🇸🇾" },
  { code: "+964", country: "IQ", flag: "🇮🇶" },
  { code: "+965", country: "KW", flag: "🇰🇼" },
  { code: "+966", country: "SA", flag: "🇸🇦" },
  { code: "+967", country: "YE", flag: "🇾🇪" },
  { code: "+968", country: "OM", flag: "🇴🇲" },
  { code: "+970", country: "PS", flag: "🇵🇸" },
  { code: "+971", country: "AE", flag: "🇦🇪" },
  { code: "+972", country: "IL", flag: "🇮🇱" },
  { code: "+973", country: "BH", flag: "🇧🇭" },
  { code: "+974", country: "QA", flag: "🇶🇦" },
  { code: "+975", country: "BT", flag: "🇧🇹" },
  { code: "+976", country: "MN", flag: "🇲🇳" },
  { code: "+977", country: "NP", flag: "🇳🇵" },
  { code: "+98", country: "IR", flag: "🇮🇷" },
  { code: "+992", country: "TJ", flag: "🇹🇯" },
  { code: "+993", country: "TM", flag: "🇹🇲" },
  { code: "+994", country: "AZ", flag: "🇦🇿" },
  { code: "+995", country: "GE", flag: "🇬🇪" },
  { code: "+996", country: "KG", flag: "🇰🇬" },
  { code: "+998", country: "UZ", flag: "🇺🇿" },
  { code: "+20", country: "EG", flag: "🇪🇬" },
  { code: "+212", country: "MA", flag: "🇲🇦" },
  { code: "+213", country: "DZ", flag: "🇩🇿" },
  { code: "+216", country: "TN", flag: "🇹🇳" },
  { code: "+218", country: "LY", flag: "🇱🇾" },
  { code: "+220", country: "GM", flag: "🇬🇲" },
  { code: "+221", country: "SN", flag: "🇸🇳" },
  { code: "+222", country: "MR", flag: "🇲🇷" },
  { code: "+223", country: "ML", flag: "🇲🇱" },
  { code: "+224", country: "GN", flag: "🇬🇳" },
  { code: "+225", country: "CI", flag: "🇨🇮" },
  { code: "+226", country: "BF", flag: "🇧🇫" },
  { code: "+227", country: "NE", flag: "🇳🇪" },
  { code: "+228", country: "TG", flag: "🇹🇬" },
  { code: "+229", country: "BJ", flag: "🇧🇯" },
  { code: "+230", country: "MU", flag: "🇲🇺" },
  { code: "+231", country: "LR", flag: "🇱🇷" },
  { code: "+232", country: "SL", flag: "🇸🇱" },
  { code: "+233", country: "GH", flag: "🇬🇭" },
  { code: "+234", country: "NG", flag: "🇳🇬" },
  { code: "+235", country: "TD", flag: "🇹🇩" },
  { code: "+236", country: "CF", flag: "🇨🇫" },
  { code: "+237", country: "CM", flag: "🇨🇲" },
  { code: "+238", country: "CV", flag: "🇨🇻" },
  { code: "+239", country: "ST", flag: "🇸🇹" },
  { code: "+240", country: "GQ", flag: "🇬🇶" },
  { code: "+241", country: "GA", flag: "🇬🇦" },
  { code: "+242", country: "CG", flag: "🇨🇬" },
  { code: "+243", country: "CD", flag: "🇨🇩" },
  { code: "+244", country: "AO", flag: "🇦🇴" },
  { code: "+245", country: "GW", flag: "🇬🇼" },
  { code: "+246", country: "IO", flag: "🇮🇴" },
  { code: "+247", country: "AC", flag: "🇦🇨" },
  { code: "+248", country: "SC", flag: "🇸🇨" },
  { code: "+249", country: "SD", flag: "🇸🇩" },
  { code: "+250", country: "RW", flag: "🇷🇼" },
  { code: "+251", country: "ET", flag: "🇪🇹" },
  { code: "+252", country: "SO", flag: "🇸🇴" },
  { code: "+253", country: "DJ", flag: "🇩🇯" },
  { code: "+254", country: "KE", flag: "🇰🇪" },
  { code: "+255", country: "TZ", flag: "🇹🇿" },
  { code: "+256", country: "UG", flag: "🇺🇬" },
  { code: "+257", country: "BI", flag: "🇧🇮" },
  { code: "+258", country: "MZ", flag: "🇲🇿" },
  { code: "+259", country: "ZM", flag: "🇿🇲" },
  { code: "+260", country: "ZW", flag: "🇿🇼" },
  { code: "+261", country: "MG", flag: "🇲🇬" },
  { code: "+262", country: "RE", flag: "🇷🇪" },
  { code: "+263", country: "ZW", flag: "🇿🇼" },
  { code: "+264", country: "NA", flag: "🇳🇦" },
  { code: "+265", country: "MW", flag: "🇲🇼" },
  { code: "+266", country: "LS", flag: "🇱🇸" },
  { code: "+267", country: "BW", flag: "🇧🇼" },
  { code: "+268", country: "SZ", flag: "🇸🇿" },
  { code: "+269", country: "KM", flag: "🇰🇲" },
  { code: "+27", country: "ZA", flag: "🇿🇦" },
  { code: "+290", country: "SH", flag: "🇸🇭" },
  { code: "+291", country: "ER", flag: "🇪🇷" },
  { code: "+297", country: "AW", flag: "🇦🇼" },
  { code: "+298", country: "FO", flag: "🇫🇴" },
  { code: "+299", country: "GL", flag: "🇬🇱" },
  { code: "+30", country: "GR", flag: "🇬🇷" },
  { code: "+31", country: "NL", flag: "🇳🇱" },
  { code: "+32", country: "BE", flag: "🇧🇪" },
  { code: "+33", country: "FR", flag: "🇫🇷" },
  { code: "+34", country: "ES", flag: "🇪🇸" },
  { code: "+350", country: "GI", flag: "🇬🇮" },
  { code: "+351", country: "PT", flag: "🇵🇹" },
  { code: "+352", country: "LU", flag: "🇱🇺" },
  { code: "+353", country: "IE", flag: "🇮🇪" },
  { code: "+354", country: "IS", flag: "🇮🇸" },
  { code: "+355", country: "AL", flag: "🇦🇱" },
  { code: "+356", country: "MT", flag: "🇲🇹" },
  { code: "+357", country: "CY", flag: "🇨🇾" },
  { code: "+358", country: "FI", flag: "🇫🇮" },
  { code: "+359", country: "BG", flag: "🇧🇬" },
  { code: "+36", country: "HU", flag: "🇭🇺" },
  { code: "+370", country: "LT", flag: "🇱🇹" },
  { code: "+371", country: "LV", flag: "🇱🇻" },
  { code: "+372", country: "EE", flag: "🇪🇪" },
  { code: "+373", country: "MD", flag: "🇲🇩" },
  { code: "+374", country: "AM", flag: "🇦🇲" },
  { code: "+375", country: "BY", flag: "🇧🇾" },
  { code: "+376", country: "AD", flag: "🇦🇩" },
  { code: "+377", country: "MC", flag: "🇲🇨" },
  { code: "+378", country: "SM", flag: "🇸🇲" },
  { code: "+379", country: "VA", flag: "🇻🇦" },
  { code: "+380", country: "UA", flag: "🇺🇦" },
  { code: "+381", country: "RS", flag: "🇷🇸" },
  { code: "+382", country: "ME", flag: "🇲🇪" },
  { code: "+383", country: "XK", flag: "🇽🇰" },
  { code: "+385", country: "HR", flag: "🇭🇷" },
  { code: "+386", country: "SI", flag: "🇸🇮" },
  { code: "+387", country: "BA", flag: "🇧🇦" },
  { code: "+389", country: "MK", flag: "🇲🇰" },
  { code: "+39", country: "IT", flag: "🇮🇹" },
  { code: "+40", country: "RO", flag: "🇷🇴" },
  { code: "+41", country: "CH", flag: "🇨🇭" },
  { code: "+420", country: "CZ", flag: "🇨🇿" },
  { code: "+421", country: "SK", flag: "🇸🇰" },
  { code: "+43", country: "AT", flag: "🇦🇹" },
  { code: "+44", country: "GB", flag: "🇬🇧" },
  { code: "+45", country: "DK", flag: "🇩🇰" },
  { code: "+46", country: "SE", flag: "🇸🇪" },
  { code: "+47", country: "NO", flag: "🇳🇴" },
  { code: "+48", country: "PL", flag: "🇵🇱" },
  { code: "+49", country: "DE", flag: "🇩🇪" },
  { code: "+500", country: "FK", flag: "🇫🇰" },
  { code: "+501", country: "BZ", flag: "🇧🇿" },
  { code: "+502", country: "GT", flag: "🇬🇹" },
  { code: "+503", country: "SV", flag: "🇸🇻" },
  { code: "+504", country: "HN", flag: "🇭🇳" },
  { code: "+505", country: "NI", flag: "🇳🇮" },
  { code: "+506", country: "CR", flag: "🇨🇷" },
  { code: "+507", country: "PA", flag: "🇵🇦" },
  { code: "+508", country: "PM", flag: "🇵🇲" },
  { code: "+509", country: "HT", flag: "🇭🇹" },
  { code: "+51", country: "PE", flag: "🇵🇪" },
  { code: "+52", country: "MX", flag: "🇲🇽" },
  { code: "+53", country: "CU", flag: "🇨🇺" },
  { code: "+54", country: "AR", flag: "🇦🇷" },
  { code: "+55", country: "BR", flag: "🇧🇷" },
  { code: "+56", country: "CL", flag: "🇨🇱" },
  { code: "+57", country: "CO", flag: "🇨🇴" },
  { code: "+58", country: "VE", flag: "🇻🇪" },
  { code: "+590", country: "GP", flag: "🇬🇵" },
  { code: "+591", country: "BO", flag: "🇧🇴" },
  { code: "+592", country: "GY", flag: "🇬🇾" },
  { code: "+593", country: "EC", flag: "🇪🇨" },
  { code: "+594", country: "GF", flag: "🇬🇫" },
  { code: "+595", country: "PY", flag: "🇵🇾" },
  { code: "+596", country: "MQ", flag: "🇲🇶" },
  { code: "+597", country: "SR", flag: "🇸🇷" },
  { code: "+598", country: "UY", flag: "🇺🇾" },
  { code: "+599", country: "CW", flag: "🇨🇼" },
  { code: "+60", country: "MY", flag: "🇲🇾" },
  { code: "+61", country: "AU", flag: "🇦🇺" },
  { code: "+62", country: "ID", flag: "🇮🇩" },
  { code: "+63", country: "PH", flag: "🇵🇭" },
  { code: "+64", country: "NZ", flag: "🇳🇿" },
  { code: "+65", country: "SG", flag: "🇸🇬" },
  { code: "+66", country: "TH", flag: "🇹🇭" },
  { code: "+670", country: "TL", flag: "🇹🇱" },
  { code: "+672", country: "NF", flag: "🇳🇫" },
  { code: "+673", country: "BN", flag: "🇧🇳" },
  { code: "+674", country: "NR", flag: "🇳🇷" },
  { code: "+675", country: "PG", flag: "🇵🇬" },
  { code: "+676", country: "TO", flag: "🇹🇴" },
  { code: "+677", country: "SB", flag: "🇸🇧" },
  { code: "+678", country: "VU", flag: "🇻🇺" },
  { code: "+679", country: "FJ", flag: "🇫🇯" },
  { code: "+680", country: "PW", flag: "🇵🇼" },
  { code: "+681", country: "WF", flag: "🇼🇫" },
  { code: "+682", country: "CK", flag: "🇨🇰" },
  { code: "+683", country: "NU", flag: "🇳🇺" },
  { code: "+685", country: "WS", flag: "🇼🇸" },
  { code: "+686", country: "KI", flag: "🇰🇮" },
  { code: "+687", country: "NC", flag: "🇳🇨" },
  { code: "+688", country: "TV", flag: "🇹🇻" },
  { code: "+689", country: "PF", flag: "🇵🇫" },
  { code: "+690", country: "TK", flag: "🇹🇰" },
  { code: "+691", country: "FM", flag: "🇫🇲" },
  { code: "+692", country: "MH", flag: "🇲🇭" },
  { code: "+850", country: "KP", flag: "🇰🇵" },
  { code: "+852", country: "HK", flag: "🇭🇰" },
  { code: "+853", country: "MO", flag: "🇲🇴" },
  { code: "+855", country: "KH", flag: "🇰🇭" },
  { code: "+856", country: "LA", flag: "🇱🇦" },
  { code: "+880", country: "BD", flag: "🇧🇩" },
  { code: "+886", country: "TW", flag: "🇹🇼" },
  { code: "+960", country: "MV", flag: "🇲🇻" },
  { code: "+961", country: "LB", flag: "🇱🇧" },
  { code: "+962", country: "JO", flag: "🇯🇴" },
  { code: "+963", country: "SY", flag: "🇸🇾" },
  { code: "+964", country: "IQ", flag: "🇮🇶" },
  { code: "+965", country: "KW", flag: "🇰🇼" },
  { code: "+966", country: "SA", flag: "🇸🇦" },
  { code: "+967", country: "YE", flag: "🇾🇪" },
  { code: "+968", country: "OM", flag: "🇴🇲" },
  { code: "+970", country: "PS", flag: "🇵🇸" },
  { code: "+971", country: "AE", flag: "🇦🇪" },
  { code: "+972", country: "IL", flag: "🇮🇱" },
  { code: "+973", country: "BH", flag: "🇧🇭" },
  { code: "+974", country: "QA", flag: "🇶🇦" },
  { code: "+975", country: "BT", flag: "🇧🇹" },
  { code: "+976", country: "MN", flag: "🇲🇳" },
  { code: "+977", country: "NP", flag: "🇳🇵" },
  { code: "+98", country: "IR", flag: "🇮🇷" },
  { code: "+992", country: "TJ", flag: "🇹🇯" },
  { code: "+993", country: "TM", flag: "🇹🇲" },
  { code: "+994", country: "AZ", flag: "🇦🇿" },
  { code: "+995", country: "GE", flag: "🇬🇪" },
  { code: "+996", country: "KG", flag: "🇰🇬" },
  { code: "+998", country: "UZ", flag: "🇺🇿" },
];

export default function LoginForm() {
  const { login, verifyOTP, isLoading } = useAuth();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [userId, setUserId] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [error, setError] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(countryCodes[0]);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Click outside handler to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowCountryDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter countries based on search query
  const filteredCountries = countryCodes.filter(
    (country) =>
      country.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.code.includes(searchQuery)
  );

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!phone) {
      setError("Please enter a valid phone number");
      return;
    }

    try {
      const fullPhoneNumber = selectedCountry.code + phone;
      await login(fullPhoneNumber);
      // In a real implementation, you would get the userId from the response
      // For now, we'll use a mock userId
      setUserId("mock-user-id");
      setShowOTP(true);
    } catch (error) {
      console.error("Login error:", error);
      setError("Failed to send OTP. Please try again.");
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!otp || otp.length < 4) {
      setError("Please enter a valid OTP");
      return;
    }

    try {
      await verifyOTP(userId, otp);
    } catch (error) {
      console.error("OTP verification error:", error);
      setError("Invalid OTP. Please try again.");
    }
  };

  const goBack = () => {
    setShowOTP(false);
    setOtp("");
    setError("");
  };

  if (showOTP) {
    return (
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md">
        {/* Mascot above title */}
        <div className="flex justify-center mb-4">
          <Image
            src="/images/mascot/tilli.png"
            alt="Tilli Mascot"
            width={80}
            height={80}
            className="rounded-full"
            priority
          />
        </div>
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Verify OTP
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Enter the 6-digit code sent to {selectedCountry.code} {phone}
          </p>
        </div>

        <form onSubmit={handleOTPSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              OTP Code
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F86E2] focus:border-transparent text-center text-lg tracking-widest text-gray-900"
                placeholder="000000"
                maxLength={6}
                required
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={goBack}
              className="flex-1 flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm sm:text-base"
            >
              <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
              <span>Back</span>
            </button>
            <button
              type="submit"
              disabled={isLoading || !otp}
              className="flex-1 flex items-center justify-center space-x-2 bg-[#4F86E2] text-white py-3 px-4 rounded-full hover:bg-[#3d6bc7] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
            >
              {isLoading ? (
                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Verify</span>
                  <ArrowRight size={18} className="sm:w-5 sm:h-5" />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs sm:text-sm text-gray-500">
            Didn't receive the code?{" "}
            <button
              onClick={handlePhoneSubmit}
              className="text-[#4F86E2] hover:text-[#3d6bc7] font-medium"
            >
              Resend
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md">
      {/* Mascot above title */}
      <div className="flex justify-center mb-4">
        <Image
          src="/images/mascot/tilli.png"
          alt="Tilli Mascot"
          width={80}
          height={80}
          className="rounded-full"
          priority
        />
      </div>
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Tilli Assessment
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Teacher Assessment Rubric System
        </p>
      </div>

      <form onSubmit={handlePhoneSubmit} className="space-y-4 sm:space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <div className="flex">
            {/* Country Code Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                className="flex items-center space-x-2 bg-gray-50 border border-gray-300 border-r-0 rounded-l-lg px-3 py-3 hover:bg-gray-100 transition-colors text-sm sm:text-base text-gray-900"
              >
                <span className="text-lg">{selectedCountry.flag}</span>
                <span className="hidden sm:block">{selectedCountry.code}</span>
                <ChevronDown size={14} className="sm:w-4 sm:h-4" />
              </button>

              {showCountryDropdown && (
                <div className="absolute top-full left-0 z-50 mt-1 w-64 max-h-60 overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-lg">
                  <div className="p-2 border-b border-gray-200">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search country..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4F86E2]"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    {filteredCountries.length > 0 ? (
                      filteredCountries.map((country) => (
                        <button
                          key={country.code}
                          type="button"
                          onClick={() => {
                            setSelectedCountry(country);
                            setShowCountryDropdown(false);
                            setSearchQuery("");
                          }}
                          className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-gray-100 text-left text-sm text-gray-900"
                        >
                          <span className="text-lg">{country.flag}</span>
                          <span className="flex-1">{country.code}</span>
                          <span className="text-xs text-gray-500">
                            {country.country}
                          </span>
                        </button>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-sm text-gray-500">
                        No countries found
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Phone Number Input */}
            <div className="flex-1 relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-[#4F86E2] focus:border-transparent text-gray-900"
                placeholder="Enter your phone number"
                required
              />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            We'll send you a verification code via SMS
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !phone}
          className="w-full flex items-center justify-center space-x-2 bg-[#4F86E2] text-white py-3 px-4 rounded-full hover:bg-[#3d6bc7] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium text-sm sm:text-base"
        >
          {isLoading ? (
            <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <span>Send Verification Code</span>
              <ArrowRight size={18} className="sm:w-5 sm:h-5" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-xs sm:text-sm text-gray-500">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
