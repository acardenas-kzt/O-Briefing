import React, { useState } from 'react';
import {
  Lightbulb,
  Mountain,
  Diamond,
  Users,
  Search,
  Award,
  Megaphone,
  RotateCw,
  UserCheck,
  FileText,
  Globe,
  Smile,
  Scale,
  Ban,
  Heart,
  ShieldAlert,
  Clock,
  HeartHandshake,
  AlertTriangle,
  Info,
  ZoomIn,
  X,
  ExternalLink,
  ShieldCheck,
  Flame,
  Droplets,
  Wine,
  Sparkles,
} from 'lucide-react';
import { BriefingData } from '../../types/briefing';

interface InternoViewProps {
  data?: BriefingData;
}

export const InternoView: React.FC<InternoViewProps> = () => {
  const [activeSection, setActiveSection] = useState<string>('all');
  const [selectedBrazaleteImgModal, setSelectedBrazaleteImgModal] = useState(false);

  const sections = [
    { id: 'all', label: 'Ver Todo' },
    { id: 'filosofia', label: '1. Filosofía' },
    { id: 'mandamientos', label: '2. Mandamientos' },
    { id: 'codigo_etico', label: '3. Código Ético' },
    { id: 'codigos_emergencia', label: '4. Códigos de Emergencia' },
    { id: 'brazaletes', label: '5. Brazaletes' },
  ];

  const scrollTo = (id: string) => {
    setActiveSection(id);
    if (id !== 'all') {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <div className="space-y-10 pb-12 font-['Montserrat',sans-serif]">
      {/* Top Section Quick Filter Bar (Hidden in Print) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-2xs flex flex-wrap items-center justify-between gap-3 print:hidden sticky top-3 z-20 backdrop-blur-md bg-white/95">
        <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 pl-2 pr-1 hidden sm:inline">
            Índice Interno:
          </span>
          {sections.map((sec) => (
            <button
              key={sec.id}
              onClick={() => scrollTo(sec.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeSection === sec.id
                  ? 'bg-[#141921] text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
              }`}
            >
              {sec.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedBrazaleteImgModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#005963] hover:bg-[#026a75] text-white text-xs font-bold transition-all shadow-2xs cursor-pointer"
          >
            <ZoomIn className="w-3.5 h-3.5" />
            <span>Lámina de Brazaletes</span>
          </button>
        </div>
      </div>

      {/* ========================================================
          1. FILOSOFÍA
      ======================================================== */}
      {(activeSection === 'all' || activeSection === 'filosofia') && (
        <section id="filosofia" className="scroll-mt-24 space-y-5 mb-[40px] print:break-inside-avoid">
          {/* Section Header with Horizontal Lines */}
          <div className="flex items-center justify-center gap-4 py-2 mb-[15px]">
            <div className="h-0.5 flex-1 max-w-[120px] sm:max-w-[200px] bg-slate-900" />
            <h2 className="text-xl sm:text-2xl font-black tracking-widest text-slate-900 uppercase">
              FILOSOFÍA
            </h2>
            <div className="h-0.5 flex-1 max-w-[120px] sm:max-w-[200px] bg-slate-900" />
          </div>

          {/* 3 Pillars Grid: Visión, Misión, Valores */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {/* VISIÓN (Negro institucional) */}
            <div className="bg-[#141921] text-white rounded-3xl p-7 pb-[25px] flex flex-col items-center justify-between text-center shadow-lg border border-slate-800 relative overflow-hidden group">
              <div className="absolute -top-12 -right-12 w-36 h-36 bg-white/5 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500" />
              
              <div className="w-full flex flex-col items-center">
                <span className="text-base sm:text-lg font-bold tracking-widest uppercase mb-6 text-slate-100">
                  VISIÓN
                </span>

                <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-6 border border-white/10 shadow-inner">
                  <Lightbulb className="w-8 h-8 text-amber-300 stroke-[1.8]" />
                </div>

                <div className="w-12 h-0.5 bg-white/20 mb-6" />

                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                  Ser <strong className="text-white font-bold">líder en operación hotelera</strong> bajo el concepto de{' '}
                  <strong className="text-white font-bold">todo incluido</strong>, diferenciándonos con un factor de{' '}
                  <strong className="text-white font-bold">entretenimiento y diversión</strong>, manteniendo la{' '}
                  <strong className="text-white font-bold">competitividad</strong> y constante{' '}
                  <strong className="text-white font-bold">innovación</strong> para maximizar la rentabilidad de{' '}
                  <strong className="text-white font-bold">nuestros socios</strong>.
                </p>
              </div>

              <div className="mt-[25px] pt-[10px] text-[10px] tracking-wider uppercase text-slate-400 font-semibold border-t border-white/10 w-full">
                Oasis Hotels & Resorts
              </div>
            </div>

            {/* MISIÓN (Blanco) */}
            <div className="bg-white text-slate-900 rounded-3xl p-7 pb-[25px] flex flex-col items-center justify-between text-center shadow-lg border border-slate-200 relative overflow-hidden group">
              <div className="w-full flex flex-col items-center">
                <span className="text-base sm:text-lg font-bold tracking-widest uppercase mb-6 text-slate-900">
                  MISIÓN
                </span>

                <div className="w-16 h-16 rounded-2xl bg-[#005963]/10 flex items-center justify-center mb-6 border border-[#005963]/20 shadow-inner">
                  <Mountain className="w-8 h-8 text-[#005963] stroke-[1.8]" />
                </div>

                <div className="w-12 h-0.5 bg-slate-300 mb-6" />

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  Superar las <strong className="text-slate-900 font-bold">expectativas</strong> de nuestros clientes, cumpliendo los más altos estándares de{' '}
                  <strong className="text-slate-900 font-bold">calidad, servicio y hospitalidad</strong> potenciando la experiencia vacacional integral.
                </p>
              </div>

              <div className="mt-[25px] pt-[10px] text-[10px] tracking-wider uppercase text-[#005963] font-bold border-t border-slate-100 w-full">
                Hospitalidad & Excelencia
              </div>
            </div>

            {/* VALORES (Azul turquesa oscuro 1) */}
            <div className="bg-[#005963] text-white rounded-3xl p-7 pb-[25px] flex flex-col items-center justify-between text-center shadow-lg border border-[#00474f] relative overflow-hidden group">
              <div className="absolute -top-12 -left-12 w-36 h-36 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500" />
              
              <div className="w-full flex flex-col items-center">
                <span className="text-base sm:text-lg font-bold tracking-widest uppercase mb-6 text-white">
                  VALORES
                </span>

                <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center mb-6 border border-white/20 shadow-inner">
                  <Diamond className="w-8 h-8 text-teal-200 stroke-[1.8]" />
                </div>

                <div className="w-12 h-0.5 bg-white/30 mb-6" />

                {/* Acronym SMILE */}
                <div className="w-full text-left max-w-[240px]">
                  {[
                    { letter: 'S', word: 'ENSACIONES', desc: 'Experiencias memorables' },
                    { letter: 'M', word: 'ÉXICO', desc: 'Orgullo e identidad caribeña' },
                    { letter: 'I', word: 'NNOVACIÓN', desc: 'Mejora continua constante' },
                    { letter: 'L', word: 'OVES YOU', desc: 'Calidez humana y empatía' },
                    { letter: 'E', word: 'NTRETENIMIENTO', desc: 'Diferenciador y diversión' },
                  ].map((item, idx) => (
                    <div
                      key={item.letter}
                      className={`h-[40px] flex items-center gap-3 bg-white/10 backdrop-blur-xs px-3.5 rounded-xl border border-white/15 ${
                        idx < 4 ? 'mb-[6px]' : ''
                      }`}
                    >
                      <span className="w-7 h-7 rounded-lg bg-white text-[#005963] font-black text-sm flex items-center justify-center shadow-2xs flex-shrink-0">
                        {item.letter}
                      </span>
                      <span className="text-xs font-bold tracking-wider text-white">
                        {item.word}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-[25px] pt-[10px] text-[10px] tracking-wider uppercase text-teal-100 font-semibold border-t border-white/15 w-full">
                Cultura S.M.I.L.E. Oasis
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================
          2. MANDAMIENTOS
      ======================================================== */}
      {(activeSection === 'all' || activeSection === 'mandamientos') && (
        <section id="mandamientos" className="scroll-mt-24 space-y-5 mb-[40px] print:break-inside-avoid">
          {/* Section Header with Horizontal Lines */}
          <div className="flex items-center justify-center gap-4 py-2 mb-[15px]">
            <div className="h-0.5 flex-1 max-w-[120px] sm:max-w-[200px] bg-slate-900" />
            <h2 className="text-xl sm:text-2xl font-black tracking-widest text-slate-900 uppercase">
              MANDAMIENTOS
            </h2>
            <div className="h-0.5 flex-1 max-w-[120px] sm:max-w-[200px] bg-slate-900" />
          </div>

          {/* 10 Mandamientos Cards Grid / Capsule Flow */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              {
                num: 1,
                theme: 'white',
                icon: Users,
                text: 'Hacer felices a nuestros clientes brindándoles experiencias inolvidables y únicas',
              },
              {
                num: 2,
                theme: 'teal1',
                icon: Search,
                text: 'Promover la cultura del detalle con calidad',
              },
              {
                num: 3,
                theme: 'white',
                icon: Lightbulb,
                text: 'Innovar para ser más competitivos',
              },
              {
                num: 4,
                theme: 'black',
                icon: Award,
                text: 'Mantener nuestros estándares de calidad sobre todas las cosas',
              },
              {
                num: 5,
                theme: 'white',
                icon: Megaphone,
                text: 'Promover el énfasis en la acción',
              },
              {
                num: 6,
                theme: 'black',
                icon: RotateCw,
                text: 'Trabajar con eficiencia',
              },
              {
                num: 7,
                theme: 'teal2',
                icon: UserCheck,
                text: 'Exigir profesionalismo a través de una actitud de portadores de soluciones',
              },
              {
                num: 8,
                theme: 'black',
                icon: FileText,
                text: 'Cumplir con nuestro código ético',
              },
              {
                num: 9,
                theme: 'white',
                icon: Globe,
                text: 'Ser responsables socialmente cuidando a nuestra comunidad y medio ambiente',
              },
              {
                num: 10,
                theme: 'teal1',
                icon: Smile,
                text: 'Fortalecer el compañerismo y el buen clima laboral',
              },
            ].map((mand) => {
              const IconComp = mand.icon;

              let cardStyles = '';
              let badgeStyles = '';
              let iconColor = '';
              let textColor = '';

              if (mand.theme === 'teal1') {
                // Azul turquesa oscuro 1 (#005963)
                cardStyles = 'bg-[#005963] text-white border-[#00474f] shadow-md';
                badgeStyles = 'bg-white text-[#005963]';
                iconColor = 'text-teal-200';
                textColor = 'text-white';
              } else if (mand.theme === 'teal2') {
                // Azul turquesa oscuro 2 (#026a75)
                cardStyles = 'bg-[#026a75] text-white border-[#01535c] shadow-md';
                badgeStyles = 'bg-white text-[#026a75]';
                iconColor = 'text-teal-200';
                textColor = 'text-white';
              } else if (mand.theme === 'black') {
                // Negro carbón (#141921)
                cardStyles = 'bg-[#141921] text-white border-slate-800 shadow-md';
                badgeStyles = 'bg-white text-slate-900';
                iconColor = 'text-slate-300';
                textColor = 'text-slate-100';
              } else {
                // Blanco
                cardStyles = 'bg-white text-slate-900 border-slate-200 shadow-sm hover:border-slate-300';
                badgeStyles = 'bg-[#141921] text-white';
                iconColor = 'text-[#005963]';
                textColor = 'text-slate-800';
              }

              return (
                <div
                  key={mand.num}
                  className={`rounded-2xl p-4 sm:px-5 sm:pt-5 pb-[15px] flex flex-col items-center text-center justify-between border transition-all duration-200 hover:-translate-y-1 ${cardStyles}`}
                >
                  <div className="w-full flex flex-col items-center">
                    {/* Number Badge */}
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-sm mb-4 shadow-2xs ${badgeStyles}`}
                    >
                      {mand.num}
                    </div>

                    {/* Icon */}
                    <div className="mt-[15px] mb-4">
                      <IconComp className={`w-7 h-7 stroke-[1.8] ${iconColor}`} />
                    </div>

                    {/* Text */}
                    <p className={`text-xs font-semibold leading-relaxed ${textColor}`}>
                      {mand.text}
                    </p>
                  </div>

                  <div className="mt-4 pt-2 w-full border-t border-current/10 text-[9px] uppercase tracking-widest opacity-60 font-mono">
                    Mandamiento #{mand.num}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ========================================================
          3. CÓDIGO ÉTICO
      ======================================================== */}
      {(activeSection === 'all' || activeSection === 'codigo_etico') && (
        <section id="codigo_etico" className="scroll-mt-24 space-y-5 mb-[40px] print:break-inside-avoid">
          {/* Section Header with Horizontal Lines */}
          <div className="flex items-center justify-center gap-4 py-2 mb-[15px]">
            <div className="h-0.5 flex-1 max-w-[120px] sm:max-w-[200px] bg-slate-900" />
            <h2 className="text-xl sm:text-2xl font-black tracking-widest text-slate-900 uppercase">
              CÓDIGO ÉTICO
            </h2>
            <div className="h-0.5 flex-1 max-w-[120px] sm:max-w-[200px] bg-slate-900" />
          </div>

          {/* 10 Principios Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[
              {
                num: 1,
                title: 'Honradez, integridad y equidad',
                desc: 'Actuar siempre con rectitud, honestidad y justicia en cada interacción, labor y proceso operativo.',
                theme: 'black',
                icon: Scale,
              },
              {
                num: 2,
                title: 'No abuso de autoridad y acoso laboral',
                desc: 'Actuar con rectitud en tus actividades, con cero tolerancia a malas prácticas.',
                theme: 'white',
                icon: Ban,
              },
              {
                num: 3,
                title: 'No discriminación',
                desc: 'No discriminar a huéspedes o a nuestros colaboradores por sus preferencias sexuales, religión, creencias, género, nacionalidad, edad, apariencia física, discapacidad o alguna enfermedad, etc.',
                theme: 'teal1',
                icon: Heart,
              },
              {
                num: 4,
                title: 'Compromiso contra hostigamiento, acoso y abuso sexual',
                desc: 'Cero tolerancia con insinuaciones y actos de carácter sexual a huéspedes, adolescentes, niños y colaboradores.',
                theme: 'white',
                icon: ShieldAlert,
              },
              {
                num: 5,
                title: 'No drogas y bebidas alcohólicas',
                desc: 'No consumir bebidas embriagantes o estupefacientes en el trabajo.',
                theme: 'black',
                icon: Wine,
              },
              {
                num: 6,
                title: 'Responsabilidad y profesionalismo',
                desc: 'Trabajar con compromiso y actitud profesional.',
                theme: 'white',
                icon: UserCheck,
              },
              {
                num: 7,
                title: 'Educación, Prudencia y Respeto',
                desc: 'Ser respetuoso y cordial tanto con huéspedes como con los demás colaboradores.',
                theme: 'teal2',
                icon: HeartHandshake,
              },
              {
                num: 8,
                title: 'Puntualidad',
                desc: 'Acudir a tiempo al trabajo y citas.',
                theme: 'white',
                icon: Clock,
              },
              {
                num: 9,
                title: 'Compromisos sólidos con la sociedad y solidaridad con nuestros colaboradores',
                desc: 'Ser una empresa socialmente responsable y mantener la Fundación Oasis.',
                theme: 'black',
                icon: Globe,
              },
              {
                num: 10,
                title: 'Lealtad hacia la empresa y confidencialidad',
                desc: 'Realizar nuestro trabajo respetando la Visión, Misión, Mandamientos y principios del Código Ético de Oasis.',
                theme: 'white',
                icon: ShieldCheck,
              },
            ].map((item) => {
              const IconComponent = item.icon;

              let cardStyles = '';
              let badgeStyles = '';
              let titleColor = '';
              let descColor = '';
              let iconColor = '';

              if (item.theme === 'teal1') {
                // Azul turquesa oscuro 1 (#005963)
                cardStyles = 'bg-[#005963] text-white border-[#00474f] shadow-md';
                badgeStyles = 'bg-white text-[#005963]';
                titleColor = 'text-white';
                descColor = 'text-teal-50';
                iconColor = 'text-teal-200';
              } else if (item.theme === 'teal2') {
                // Azul turquesa oscuro 2 (#026a75)
                cardStyles = 'bg-[#026a75] text-white border-[#01535c] shadow-md';
                badgeStyles = 'bg-white text-[#026a75]';
                titleColor = 'text-white';
                descColor = 'text-teal-50';
                iconColor = 'text-teal-200';
              } else if (item.theme === 'black') {
                // Negro carbón (#141921)
                cardStyles = 'bg-[#141921] text-white border-slate-800 shadow-md';
                badgeStyles = 'bg-[#005963] text-white';
                titleColor = 'text-white';
                descColor = 'text-slate-300';
                iconColor = 'text-teal-400';
              } else {
                // Blanco
                cardStyles = 'bg-white text-slate-900 border-slate-200 shadow-xs hover:border-slate-300';
                badgeStyles = 'bg-[#141921] text-white';
                titleColor = 'text-slate-900';
                descColor = 'text-slate-600';
                iconColor = 'text-[#005963]';
              }

              return (
                <div
                  key={item.num}
                  className={`rounded-2xl p-5 pb-[15px] border flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 ${cardStyles}`}
                >
                  <div>
                    {/* Top Header inside Card: Number + Icon */}
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs shadow-2xs ${badgeStyles}`}
                      >
                        {item.num}
                      </span>
                      <IconComponent className={`w-6 h-6 stroke-[1.8] ${iconColor}`} />
                    </div>

                    {/* Title */}
                    <h3 className={`font-black text-xs sm:text-sm tracking-tight mb-2 ${titleColor}`}>
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className={`text-xs leading-relaxed font-normal ${descColor}`}>
                      {item.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-current/10 text-[9px] uppercase tracking-wider opacity-60 font-mono">
                    Principio #{item.num}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ========================================================
          4. CÓDIGOS DE EMERGENCIA Y CÓDIGOS INFORMATIVOS
      ======================================================== */}
      {(activeSection === 'all' || activeSection === 'codigos_emergencia') && (
        <section id="codigos_emergencia" className="scroll-mt-24 space-y-6 mb-[40px] print:break-inside-avoid">
          {/* Section Header with Horizontal Lines */}
          <div className="flex items-center justify-center gap-4 py-2 mb-[15px]">
            <div className="h-0.5 flex-1 max-w-[120px] sm:max-w-[200px] bg-slate-900" />
            <h2 className="text-xl sm:text-2xl font-black tracking-widest text-slate-900 uppercase text-center">
              CÓDIGOS DE EMERGENCIA Y CÓDIGOS INFORMATIVOS
            </h2>
            <div className="h-0.5 flex-1 max-w-[120px] sm:max-w-[200px] bg-slate-900" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* 4.A CÓDIGOS DE EMERGENCIA (col-span-8) */}
            <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-sm tracking-wider uppercase">
                      CÓDIGOS DE EMERGENCIA
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Protocolos de seguridad y respuesta inmediata Oasis
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
                  20 Códigos
                </span>
              </div>

              {/* Emergency Codes Table/List */}
              <div className="divide-y divide-slate-100 text-xs">
                {[
                  { tagBg: '#facc15', tagText: '#000000', num: '1', name: 'AMARILLO 1', desc: 'Accidente no grave' },
                  { tagBg: '#facc15', tagText: '#000000', num: '2', name: 'AMARILLO 2', desc: 'Accidente' },
                  { tagBg: '#facc15', tagText: '#000000', num: '3', name: 'AMARILLO 3', desc: 'Accidente con traslado' },
                  { tagBg: '#f59e0b', tagText: '#ffffff', num: '1', name: 'ÁMBAR 1', desc: 'Extravío de infante' },
                  { tagBg: '#ea580c', tagText: '#ffffff', num: '2', name: 'ÁMBAR 2', desc: 'Persona extraviada o secuestro' },
                  { tagBg: '#0ea5e9', tagText: '#ffffff', num: '', name: 'AZUL', desc: 'Emergencia acuática' },
                  { tagBg: '#ffffff', tagText: '#0f172a', border: '#94a3b8', num: '', name: 'BLANCO', desc: 'Posible robo o extravío' },
                  { tagBg: '#78350f', tagText: '#ffffff', num: '1', name: 'CAFÉ 1', desc: 'Riña o asalto' },
                  { tagBg: '#78350f', tagText: '#ffffff', num: '2', name: 'CAFÉ 2', desc: 'Consumo de estupefaciente o droga' },
                  { tagBg: '#78350f', tagText: '#ffffff', num: '3', name: 'CAFÉ 3', desc: 'Tentativa de agresión sexual' },
                  { tagBg: '#64748b', tagText: '#ffffff', num: '', name: 'GRIS', desc: 'Fuga de gas' },
                  { tagBg: '#18181b', tagText: '#ffffff', num: '', name: 'NEGRO', desc: 'Fallecimiento' },
                  { tagBg: '#6b21a8', tagText: '#ffffff', num: '1', name: 'MORADO 1', desc: 'Amenaza de bomba' },
                  { tagBg: '#6b21a8', tagText: '#ffffff', num: '2', name: 'MORADO 2', desc: 'Extorsión telefónica' },
                  { tagBg: '#6b21a8', tagText: '#ffffff', num: '3', name: 'MORADO 3', desc: 'Ataque cibernético' },
                  { tagBg: '#6b21a8', tagText: '#ffffff', num: '4', name: 'MORADO 4', desc: 'Ataque químico, biológico o radiológico' },
                  { tagBg: '#f97316', tagText: '#ffffff', num: '1', name: 'NARANJA 1', desc: 'Conato de Incendio' },
                  { tagBg: '#ea580c', tagText: '#ffffff', num: '2', name: 'NARANJA 2', desc: 'Incendio declarado' },
                  {
                    tagBg: '#16a34a',
                    tagText: '#ffffff',
                    num: '',
                    name: 'VERDE',
                    desc: 'Motines, huelgas o manifestaciones (conflictos políticos o sociales)',
                  },
                  {
                    tagBg: '#ffffff',
                    tagText: '#0f172a',
                    border: '#cbd5e1',
                    num: 'ALFA',
                    name: 'ALFA',
                    desc: 'Situación de arma de fuego o rehenes',
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="py-[7px] px-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50 transition-colors rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      {/* Color Tag Bar */}
                      <div
                        className="w-14 h-6 rounded-md flex items-center justify-center font-black text-xs shadow-2xs flex-shrink-0"
                        style={{
                          backgroundColor: item.tagBg,
                          color: item.tagText,
                          border: item.border ? `1px solid ${item.border}` : 'none',
                        }}
                      >
                        {item.num}
                      </div>

                      <span className="font-black text-xs text-slate-900 tracking-wide uppercase min-w-[120px]">
                        {item.name}
                      </span>
                    </div>

                    <span className="text-xs text-slate-700 font-medium sm:text-right pl-17 sm:pl-0">
                      {item.desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 4.B CÓDIGOS INFORMATIVOS (col-span-4) */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-teal-100 text-[#005963] flex items-center justify-center">
                      <Info className="w-4 h-4 stroke-[2.2]" />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 text-sm tracking-wider uppercase">
                        CÓDIGOS INFORMATIVOS
                      </h3>
                      <p className="text-[11px] text-slate-500 font-medium">
                        Alertas y avisos operativos en instalaciones
                      </p>
                    </div>
                  </div>
                </div>

                <div className="divide-y divide-slate-100 text-xs">
                  {[
                    {
                      tagBg: '#5c1d18',
                      tagText: '#ffffff',
                      num: '',
                      name: 'MARRÓN',
                      desc: 'Valores a la vista',
                    },
                    {
                      tagBg: '#ec4899',
                      tagText: '#ffffff',
                      num: '',
                      name: 'ROSA',
                      desc: 'Inundación en áreas',
                    },
                    {
                      tagBg: '#8b5cf6',
                      tagText: '#ffffff',
                      num: '',
                      name: 'VIOLETA',
                      desc: 'Servicio Room Service en piso (Servicio de muertos)',
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="py-[7px] px-3 flex flex-col gap-1.5 hover:bg-slate-50 transition-colors rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-14 h-6 rounded-md flex items-center justify-center font-black text-xs shadow-2xs flex-shrink-0"
                          style={{
                            backgroundColor: item.tagBg,
                            color: item.tagText,
                          }}
                        >
                          {item.num}
                        </div>
                        <span className="font-black text-xs text-slate-900 tracking-wide uppercase">
                          {item.name}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 font-medium pl-17">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Note Box */}
              <div className="bg-[#141921] text-white rounded-3xl p-6 shadow-md border border-slate-800">
                <div className="flex items-center gap-2 mb-2 text-teal-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-[11px] font-black uppercase tracking-wider">
                    Protocolo de Seguridad
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  Ante la activación de cualquier código de emergencia o informativo, mantener la calma, reportar vía radio a Seguridad y conmutador, y seguir estrictamente los lineamientos del manual de procedimientos de Oasis Hotels & Resorts.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================
          5. BRAZALETES
      ======================================================== */}
      {(activeSection === 'all' || activeSection === 'brazaletes') && (
        <section id="brazaletes" className="scroll-mt-24 space-y-6 print:break-inside-avoid">
          {/* Section Header with Horizontal Lines */}
          <div className="flex items-center justify-center gap-4 py-2 mb-[15px]">
            <div className="h-0.5 flex-1 max-w-[120px] sm:max-w-[200px] bg-slate-900" />
            <h2 className="text-xl sm:text-2xl font-black tracking-widest text-slate-900 uppercase">
              BRAZALETES
            </h2>
            <div className="h-0.5 flex-1 max-w-[120px] sm:max-w-[200px] bg-slate-900" />
          </div>

          {/* Action Callout Bar */}
          <div className="bg-[#005963] text-white rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
            <div>
              <h4 className="font-black text-xs sm:text-sm tracking-wide uppercase">
                Catálogo Oficial de Brazaletes de Huéspedes y Pases
              </h4>
              <p className="text-[11px] text-teal-100 font-medium mt-0.5">
                Clasificación por categorías, colores, diseño físico y nivel de acceso para control y servicio.
              </p>
            </div>
            <button
              onClick={() => setSelectedBrazaleteImgModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-[#005963] hover:bg-slate-100 font-black text-xs transition-all shadow-sm cursor-pointer whitespace-nowrap"
            >
              <ZoomIn className="w-4 h-4" />
              <span>Ver Lámina Gráfica Original</span>
            </button>
          </div>

          {/* Structured Brazaletes Table */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            {/* Table Header */}
            <div className="grid grid-cols-12 bg-[#1a2536] text-white text-center py-3 px-4 font-black text-xs tracking-wider uppercase">
              <div className="col-span-3 sm:col-span-2 text-left">COLOR</div>
              <div className="col-span-5 sm:col-span-6 text-left">BRAZALETE / DISEÑO</div>
              <div className="col-span-4 text-left">SIGNIFICADO / ACCESO</div>
            </div>

            {/* GROUP 1: CATEGORÍAS VIP & CLUB VACACIONAL */}
            <div className="bg-[#8a6730] text-white px-4 py-2 font-black text-xs tracking-wider uppercase">
              CATEGORÍAS VIP & CLUB VACACIONAL
            </div>
            <div className="divide-y divide-slate-100">
              {[
                {
                  color: 'NEGRO / DORADO',
                  colorSample: (
                    <div className="w-5 h-5 rounded-full overflow-hidden flex border border-slate-300 shadow-2xs">
                      <div className="w-1/2 h-full bg-black" />
                      <div className="w-1/2 h-full bg-[#bfa15f]" />
                    </div>
                  ),
                  brazaleteText: 'OASIS THE LEISURE CLUB',
                  brazaleteSub: 'Banda negra con dorado y sellos OTLC',
                  significado: 'OASIS The Leisure Club • THE PYRAMID CANCUN',
                },
                {
                  color: 'DORADO',
                  colorSample: (
                    <div className="w-5 h-5 rounded-full bg-[#bfa15f] border border-slate-300 shadow-2xs" />
                  ),
                  brazaleteText: '✿♥U - VIP',
                  brazaleteSub: 'Dorado con letras negras y patrón Oasis',
                  significado: 'VIP Estancia o VIP Especial',
                },
                {
                  color: 'ROSA TRANSPARENTE',
                  colorSample: (
                    <div className="w-5 h-5 rounded-full bg-pink-100 border border-pink-300 shadow-2xs" />
                  ),
                  brazaleteText: "THE SIAN KA'AN AT THE PYRAMID",
                  brazaleteSub: 'Rosa translúcido con tipografía formal',
                  significado: "SIAN KA'AN Club at The Pyramid",
                },
                {
                  color: 'NEGRO',
                  colorSample: (
                    <div className="w-5 h-5 rounded-full bg-[#18181b] border border-slate-300 shadow-2xs" />
                  ),
                  brazaleteText: '✿♥U',
                  brazaleteSub: 'Negro mate con perforaciones y tipografía The Pyramid',
                  significado: 'THE PYRAMID CANCUN',
                },
                {
                  color: 'AZUL / DORADO',
                  colorSample: (
                    <div className="w-5 h-5 rounded-full overflow-hidden flex border border-slate-300 shadow-2xs">
                      <div className="w-1/2 h-full bg-[#1d4ed8]" />
                      <div className="w-1/2 h-full bg-[#bfa15f]" />
                    </div>
                  ),
                  brazaleteText: 'OASIS THE LEISURE CLUB',
                  brazaleteSub: 'Azul rey con dorado y distintivo OTLC',
                  significado: 'OASIS The Leisure Club • THE GRAND OASIS CANCUN',
                },
              ].map((row, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-12 items-center py-3 px-4 text-xs hover:bg-slate-50 transition-colors"
                >
                  <div className="col-span-3 sm:col-span-2 flex items-center gap-2">
                    {row.colorSample}
                    <span className="font-bold text-slate-800 text-[11px] leading-tight">
                      {row.color}
                    </span>
                  </div>
                  <div className="col-span-5 sm:col-span-6 pr-2">
                    <span className="font-mono font-black text-slate-900 block text-[11.5px]">
                      {row.brazaleteText}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {row.brazaleteSub}
                    </span>
                  </div>
                  <div className="col-span-4">
                    <span className="font-bold text-[#005963] text-xs">
                      {row.significado}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* GROUP 2: CATEGORÍA ESTÁNDAR Y MERCADO ESPECIAL */}
            <div className="bg-[#026a75] text-white px-4 py-2 font-black text-xs tracking-wider uppercase">
              CATEGORÍA ESTÁNDAR Y MERCADO ESPECIAL
            </div>
            <div className="divide-y divide-slate-100">
              {[
                {
                  color: 'COLORES USA',
                  colorSample: (
                    <div className="w-5 h-5 rounded-full overflow-hidden flex flex-col border border-slate-300 shadow-2xs">
                      <div className="h-1/2 bg-[#1d4ed8]" />
                      <div className="h-1/2 bg-[#dc2626]" />
                    </div>
                  ),
                  brazaleteText: '✿♥U - GRAND PLUS',
                  brazaleteSub: 'Franjas estilo bandera USA (rojo, blanco, azul)',
                  significado: 'ALG / Mercado USA',
                },
                {
                  color: 'AZUL',
                  colorSample: (
                    <div className="w-5 h-5 rounded-full bg-[#1d4ed8] border border-slate-300 shadow-2xs" />
                  ),
                  brazaleteText: '✿♥U - GRAND',
                  brazaleteSub: 'Azul rey estándar con tipografía blanca',
                  significado: 'THE GRAND OASIS CANCUN',
                },
              ].map((row, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-12 items-center py-3 px-4 text-xs hover:bg-slate-50 transition-colors"
                >
                  <div className="col-span-3 sm:col-span-2 flex items-center gap-2">
                    {row.colorSample}
                    <span className="font-bold text-slate-800 text-[11px] leading-tight">
                      {row.color}
                    </span>
                  </div>
                  <div className="col-span-5 sm:col-span-6 pr-2">
                    <span className="font-mono font-black text-slate-900 block text-[11.5px]">
                      {row.brazaleteText}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {row.brazaleteSub}
                    </span>
                  </div>
                  <div className="col-span-4">
                    <span className="font-bold text-[#026a75] text-xs">
                      {row.significado}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* GROUP 3: MENORES DE EDAD | NO ALCOHOL */}
            <div className="bg-[#4c1d6b] text-white px-4 py-2 font-black text-xs tracking-wider uppercase">
              MENORES DE EDAD | NO ALCOHOL
            </div>
            <div className="divide-y divide-slate-100">
              {[
                {
                  color: 'BLANCO CON LETRAS MORADAS',
                  colorSample: (
                    <div className="w-5 h-5 rounded-full bg-white border-2 border-purple-600 shadow-2xs" />
                  ),
                  brazaleteText: '✿♥U - NO ALCOHOL',
                  brazaleteSub: 'Blanco con texto morado y leyenda preventiva',
                  significado: 'Menores de edad en TODAS LAS CATEGORÍAS',
                },
              ].map((row, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-12 items-center py-3 px-4 text-xs hover:bg-slate-50 transition-colors"
                >
                  <div className="col-span-3 sm:col-span-2 flex items-center gap-2">
                    {row.colorSample}
                    <span className="font-bold text-slate-800 text-[11px] leading-tight">
                      {row.color}
                    </span>
                  </div>
                  <div className="col-span-5 sm:col-span-6 pr-2">
                    <span className="font-mono font-black text-purple-900 block text-[11.5px]">
                      {row.brazaleteText}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {row.brazaleteSub}
                    </span>
                  </div>
                  <div className="col-span-4">
                    <span className="font-bold text-purple-800 text-xs">
                      {row.significado}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* GROUP 4: DAY PASS & NIGHT PASS TODOS LOS COMPLEJOS */}
            <div className="bg-[#d97706] text-white px-4 py-2 font-black text-xs tracking-wider uppercase">
              DAY PASS & NIGHT PASS TODOS LOS COMPLEJOS
            </div>
            <div className="divide-y divide-slate-100">
              {[
                {
                  color: 'PAPEL DORADO',
                  colorSample: (
                    <div className="w-5 h-5 rounded-full bg-[#d4af37] border border-amber-600 shadow-2xs" />
                  ),
                  brazaleteText: 'DAY PASS VIP - OASIS LOVES U',
                  brazaleteSub: 'Tyvek papel oro laminado',
                  significado: 'Day Pass VIP Dirección',
                },
                {
                  color: 'PAPEL CAFÉ',
                  colorSample: (
                    <div className="w-5 h-5 rounded-full bg-[#78350f] border border-amber-900 shadow-2xs" />
                  ),
                  brazaleteText: 'DAY PASS VIP - OASIS LOVES U',
                  brazaleteSub: 'Tyvek café ejecutivo',
                  significado: 'Day Pass Ejecutivo Tarjeta Ejecutiva',
                },
                {
                  color: 'BRAZALETE DE PAPEL',
                  colorSample: (
                    <div className="w-5 h-5 rounded-full bg-yellow-400 border border-slate-300 shadow-2xs" />
                  ),
                  brazaleteText: 'OASIS HOTELS & RESORTS (DIARIO)',
                  brazaleteSub: 'LUN (Amarillo), MAR (Naranja), MIE (Gris), JUE (Azul), VIE (Morado), SAB (Verde), DOM (Rojo)',
                  significado: 'DAYPASS — Color varía según el día de la semana',
                },
                {
                  color: 'PAPEL ROSA',
                  colorSample: (
                    <div className="w-5 h-5 rounded-full bg-[#ec4899] border border-pink-400 shadow-2xs" />
                  ),
                  brazaleteText: 'OASIS HOTELS & RESORTS (ROSA)',
                  brazaleteSub: 'Tyvek rosa fluorescente',
                  significado: 'NIGHT PASS',
                },
                {
                  color: 'PAPEL AQUA',
                  colorSample: (
                    <div className="w-5 h-5 rounded-full bg-[#14b8a6] border border-teal-400 shadow-2xs" />
                  ),
                  brazaleteText: 'OASIS HOTELS & RESORTS (AQUA)',
                  brazaleteSub: 'Tyvek aqua turquesa',
                  significado: 'OVER NIGHT PASS',
                },
                {
                  color: 'PAPEL BLANCO',
                  colorSample: (
                    <div className="w-5 h-5 rounded-full bg-white border border-slate-400 shadow-2xs" />
                  ),
                  brazaleteText: 'OASIS HOTELS & RESORTS (BLANCO)',
                  brazaleteSub: 'Tyvek blanco menor',
                  significado: 'DAYPASS NIÑOS - SIN ALCOHOL',
                },
              ].map((row, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-12 items-center py-3 px-4 text-xs hover:bg-slate-50 transition-colors"
                >
                  <div className="col-span-3 sm:col-span-2 flex items-center gap-2">
                    {row.colorSample}
                    <span className="font-bold text-slate-800 text-[11px] leading-tight">
                      {row.color}
                    </span>
                  </div>
                  <div className="col-span-5 sm:col-span-6 pr-2">
                    <span className="font-mono font-black text-slate-900 block text-[11.5px]">
                      {row.brazaleteText}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {row.brazaleteSub}
                    </span>
                  </div>
                  <div className="col-span-4">
                    <span className="font-bold text-amber-800 text-xs">
                      {row.significado}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Inline Embedded Visual Graphic Sheet */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-200 gap-2">
              <div>
                <h3 className="font-black text-slate-900 text-sm tracking-wider uppercase">
                  LÁMINA GRÁFICA VISUAL DE BRAZALETES
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  Muestra física de los brazaletes oficiales y logotipos autorizados para control en accesos
                </p>
              </div>
              <button
                onClick={() => setSelectedBrazaleteImgModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer self-start sm:self-auto"
              >
                <ZoomIn className="w-4 h-4 text-[#005963]" />
                <span>Ampliar Imagen</span>
              </button>
            </div>

            <div
              onClick={() => setSelectedBrazaleteImgModal(true)}
              className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-center p-2 hover:border-[#005963]/50 transition-all shadow-inner"
            >
              <img
                src="/assets/aistudio/image_aea54f09.png"
                alt="Lámina Oficial de Brazaletes Oasis Hotels & Resorts"
                className="w-full max-h-[700px] object-contain rounded-xl group-hover:scale-[1.01] transition-transform duration-300"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-[#005963]/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                <span className="bg-[#141921] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg">
                  <ZoomIn className="w-4 h-4" />
                  Haz clic para ver en pantalla completa
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Modal: Fullscreen View of Brazaletes Sheet */}
      {selectedBrazaleteImgModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative max-w-5xl w-full max-h-[92vh] bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col">
            {/* Modal Header */}
            <div className="bg-[#141921] text-white px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-black text-sm tracking-wider uppercase">
                  Lámina Oficial de Brazaletes • Oasis Hotels & Resorts
                </h3>
                <p className="text-[11px] text-slate-400">
                  Referencia visual completa de brazaletes, sellos y categorías
                </p>
              </div>
              <button
                onClick={() => setSelectedBrazaleteImgModal(false)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 overflow-auto flex items-center justify-center bg-slate-100 max-h-[calc(92vh-75px)]">
              <img
                src="/assets/aistudio/image_aea54f09.png"
                alt="Brazaletes Oasis en Alta Definición"
                className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-md"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
