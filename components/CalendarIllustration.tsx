export default function CalendarIllustration({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 560 390" fill="none" role="img" aria-label="Minh họa lịch học và đồng hồ nhắc hạn nộp">
      <defs>
        <linearGradient id="calendar-blue" x1="40" y1="0" x2="520" y2="390" gradientUnits="userSpaceOnUse"><stop stopColor="#193ac9" /><stop offset="1" stopColor="#3262ef" /></linearGradient>
        <linearGradient id="calendar-red" x1="112" y1="69" x2="440" y2="125" gradientUnits="userSpaceOnUse"><stop stopColor="#f52226" /><stop offset="1" stopColor="#d60918" /></linearGradient>
        <filter id="calendar-shadow" x="-25%" y="-25%" width="160%" height="170%"><feDropShadow dx="0" dy="13" stdDeviation="12" floodColor="#0d206e" floodOpacity=".24" /></filter>
      </defs>
      <rect width="560" height="390" rx="24" fill="url(#calendar-blue)" />
      <path d="M0 295C100 228 173 349 295 300S456 214 560 241V390H0Z" fill="#123cc4" fillOpacity=".45" />
      <circle cx="475" cy="61" r="106" fill="#fff" fillOpacity=".045" />
      <circle cx="36" cy="55" r="110" fill="#fff" fillOpacity=".025" />
      <g filter="url(#calendar-shadow)" transform="rotate(-3 270 190)">
        <rect x="102" y="73" width="331" height="252" rx="17" fill="#fefdf9" />
        <path d="M102 90a17 17 0 0 1 17-17h297a17 17 0 0 1 17 17v44H102Z" fill="url(#calendar-red)" />
        <path d="M102 128h331v6H102Z" fill="#b80b16" fillOpacity=".3" />
        <rect x="151" y="56" width="12" height="38" rx="6" fill="#172431" />
        <rect x="371" y="56" width="12" height="38" rx="6" fill="#172431" />
        {Array.from({ length: 28 }, (_, i) => <rect key={i} x={122 + i % 7 * 42} y={153 + Math.floor(i / 7) * 37} width="31" height="26" rx="4" fill={i === 11 ? '#ffb526' : i === 17 ? '#f9d5d2' : '#eaece9'} />)}
        <path d="m253 235 6 6 11-13" stroke="#d8292e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g filter="url(#calendar-shadow)">
        <circle cx="432" cy="303" r="66" fill="#172b36" />
        <circle cx="432" cy="303" r="59" fill="#fffdf4" />
        <circle cx="432" cy="303" r="52" stroke="#ebe8de" strokeWidth="1.5" />
        {[0, 90, 180, 270].map((angle) => <path key={angle} d="M432 256v7" stroke="#a6aaa3" strokeWidth="2" strokeLinecap="round" transform={'rotate(' + angle + ' 432 303)'} />)}
        <path d="M432 270v33l25 18" stroke="#de292c" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="432" cy="303" r="5" fill="#de292c" />
      </g>
      <path d="M57 119h15m-7-8v16M486 177h12m-6-6v12" stroke="white" strokeOpacity=".45" strokeWidth="2" strokeLinecap="round" />
      <circle cx="505" cy="121" r="4" fill="white" fillOpacity=".3" />
    </svg>
  );
}
