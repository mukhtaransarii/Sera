export function Logo() {
  return (
    <img 
     src="/MeemLogo.webp" 
     alt="meem logo" 
     className="w-8"
    />
  )
}

export function Text() {
  return (
      <p className="text-xl font-bold font-[ClashDisplay] text-green-700">Sera</p>
  )
}

export function LogoWithText() {
  return (
    <div className="flex items-center gap-1">
      <img 
        src="/MeemLogo.webp" 
        alt="meem logo" 
        className="w-8"
       />
      <p className="text-xl font-bold font-[ClashDisplay]">Sera</p>
    </div>
  )
}

