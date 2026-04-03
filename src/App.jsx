import React, { useState, useEffect, useRef } from 'react';
import { 
  Map, 
  Leaf, 
  Ship, 
  Building2, 
  Cpu, 
  Waves, 
  Info, 
  X, 
  Sparkles, 
  MapPin, 
  TrendingUp,
  Layers,
  Factory,
  Trophy,
  Calendar,
  Users,
  FileVideo,
  Target,
  CheckCircle,
  BookOpen,
  ShieldCheck,
  Wrench,
  Globe
} from 'lucide-react';

// --- STYLES GLOBAUX ---
const globalStyles = `
  .custom-scrollbar::-webkit-scrollbar { width: 6px; }
  .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
  .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
  
  /* Surcharge Leaflet pour s'intégrer proprement */
  .leaflet-container { background: transparent; font-family: inherit; }
  .leaflet-control-attribution { background: rgba(255,255,255,0.8) !important; font-size: 10px !important; }
`;

// --- DONNÉES DES PROJETS ---
const THEMES = {
  ALL: { id: 'ALL', label: 'Tous les projets', hex: '#475569', color: 'bg-slate-100 text-slate-700 border-slate-300' },
  BLUE: { id: 'BLUE', label: 'Économie Bleue', hex: '#0284c7', color: 'bg-sky-50 text-sky-700 border-sky-300' },
  GREEN: { id: 'GREEN', label: 'Ville Verte & Résiliente', hex: '#10b981', color: 'bg-emerald-50 text-emerald-700 border-emerald-300' },
  SMART: { id: 'SMART', label: 'Smart & Inclusive', hex: '#8b5cf6', color: 'bg-violet-50 text-violet-700 border-violet-300' },
  INFRA: { id: 'INFRA', label: 'Infrastructures', hex: '#f97316', color: 'bg-orange-50 text-orange-700 border-orange-300' }
};

// Coordonnées GPS Réelles (Latitude, Longitude) issues du Google Sheet
const PROJECTS = [
  {
    id: 'p1', title: 'Nouveau Viaduc de Bizerte', theme: THEMES.INFRA,
    lat: 37.252851, lng: 9.855360, icon: <MapPin className="w-5 h-5" />,
    problem: "Saturation du pont mobile actuel bloquant le trafic.",
    vision: "Viaduc pour une fluidité routière et maritime totale avec voies pour mobilités douces.",
    stats: [{ label: 'Localisation', value: 'Canal de Bizerte' }, { label: 'Trafic', value: '> 41 000 véh./j' }],
    prompt: "Futuristic suspension bridge over Bizerte canal, glowing smart LED lighting, integrating pedestrian green pathways, sustainable architecture, 8k resolution, photorealistic cinematic lighting."
  },
  {
    id: 'p2', title: 'Marina Bizerte Cap 3000', theme: THEMES.BLUE,
    lat: 37.277576, lng: 9.882756, icon: <Ship className="w-5 h-5" />,
    problem: "Sous-exploitation du front de mer pour le tourisme de plaisance.",
    vision: "Port de plaisance de haut standing intégré à la vieille ville pour dynamiser l'économie bleue.",
    stats: [{ label: 'Localisation', value: 'Bizerte Nord' }, { label: 'Capacité', value: '900 anneaux' }],
    prompt: "A breathtaking modern marina in Bizerte, futuristic sleek yachts, eco-friendly waterfront promenade with smart tech, sunset glow, architectural visualization, hyper-detailed."
  },
  {
    id: 'p3', title: 'Technopôle Agroalimentaire', theme: THEMES.SMART,
    lat: 37.242194, lng: 9.888128, icon: <Cpu className="w-5 h-5" />,
    problem: "Manque d'infrastructures reliant recherche universitaire et industrie agricole.",
    vision: "Hub d'innovation régional avec incubateurs et centres de recherche.",
    stats: [{ label: 'Localisation', value: 'Menzel Jemil' }, { label: 'Zone industrielle', value: '147 Hectares' }],
    prompt: "A highly advanced agro-tech research campus, sustainable glass and steel architecture, rooftop greenhouses, drone delivery systems, biophilic design, 3D render."
  },
  {
    id: 'p4', title: 'Dépollution du Lac de Bizerte', theme: THEMES.GREEN,
    lat: 37.191012, lng: 9.852449, icon: <Waves className="w-5 h-5" />,
    problem: "Pression industrielle menaçant l'écosystème du lac.",
    vision: "Lac cristallin avec parcs écologiques, aquaculture et gestion zéro-déchet.",
    stats: [{ label: 'Cible', value: 'Lac de Bizerte' }, { label: 'Superficie', value: '150 km²' }],
    prompt: "Aerial view of a pristine clean Bizerte lake, people enjoying eco-friendly water sports, green floating aquaculture farms, clean futuristic coastal city in background."
  },
  {
    id: 'p5', title: 'Port nouvelle Génération (Errimel)', theme: THEMES.BLUE,
    lat: 37.255648, lng: 9.918476, icon: <Ship className="w-5 h-5" />,
    problem: "Limites du port actuel (tirant d'eau, pont mobile) pour les flux mondiaux.",
    vision: "Port de 3ème génération avec vaste zone logistique (Hub méditerranéen).",
    stats: [{ label: 'Localisation', value: 'Plage d\'Errimel' }, { label: 'Vocation', value: 'Plateforme Logistique' }],
    prompt: "Futuristic automated deep-water port, smart robotic cranes handling cargo, eco-friendly logistics hub, integrated rail network, massive cargo ships, cinematic lighting."
  },
  {
    id: 'p6', title: 'Plateforme Multimodale', theme: THEMES.SMART,
    lat: 37.236078, lng: 9.883252, icon: <Building2 className="w-5 h-5" />,
    problem: "Dispersion des instituts et manque d'infrastructures d'accueil.",
    vision: "Campus unifié, moderne et connecté favorisant les synergies avec le Technopôle.",
    stats: [{ label: 'Localisation', value: 'Menzel Abderrahmen' }, { label: 'Connexion', value: 'Pôle Compétitivité' }],
    prompt: "A modern multimodal university campus in Tunisia, futuristic educational buildings, large green plazas with students, smart solar trees, interactive displays, bright daylight."
  },
  {
    id: 'p7', title: 'Pôle urbain & Station Éco-Touristique', theme: THEMES.GREEN,
    lat: 37.344054, lng: 9.748330, icon: <Leaf className="w-5 h-5" />,
    problem: "Sous-exploitation du potentiel naturel du littoral nord (Ras Angela).",
    vision: "Station touristique 100% écologique (lodges) préservant la forêt et le littoral.",
    stats: [{ label: 'Localisation', value: 'Cap Angela' }, { label: 'Investissement', value: '1500 MD' }],
    prompt: "Eco-luxury lodges integrated into a lush forest cliffside overlooking the Mediterranean sea, Ras Angela, sustainable biophilic architecture, infinity pools blending with nature."
  },
  {
    id: 'p8', title: 'PDAI Sejnane (Agro-Écologie)', theme: THEMES.GREEN,
    lat: 37.063836, lng: 9.230287, icon: <Leaf className="w-5 h-5" />,
    problem: "Vulnérabilité climatique et manque d'intégration économique des zones rurales.",
    vision: "Pôle de développement agricole intégré promouvant l'agro-écologie et l'autonomisation rurale.",
    stats: [{ label: 'Localisation', value: 'Sejnane' }, { label: 'Secteur', value: 'Agro-sylvo-pastoral' }],
    prompt: "Eco-friendly agricultural village in Sejnane Tunisia, lush green terraces, smart farming technology, sustainable rural architecture, cinematic lighting, 8k."
  },
  {
    id: 'p9', title: 'Programme PACTE Ghezala', theme: THEMES.GREEN,
    lat: 37.081795, lng: 9.533358, icon: <Waves className="w-5 h-5" />,
    problem: "Ressources en eaux et sols menacées par l'érosion et les variations climatiques.",
    vision: "Adaptation au changement climatique et sécurisation hydrique pour les terres agricoles.",
    stats: [{ label: 'Localisation', value: 'Ghezala' }, { label: 'Objectif', value: 'Résilience climatique' }],
    prompt: "Advanced water management and irrigation system in a rural green valley in Ghezala Tunisia, climate change adaptation, solar powered pumps, beautiful landscape, photorealistic."
  },
  {
    id: 'p10', title: 'Pôle Logistique Agricole', theme: THEMES.INFRA,
    lat: 37.061752, lng: 9.641100, icon: <Building2 className="w-5 h-5" />,
    problem: "Manque d'infrastructures modernes de stockage et logistique pour l'exportation.",
    vision: "Plateforme de conditionnement connectée par voie ferrée au port d'Errimel.",
    stats: [{ label: 'Localisation', value: 'Plaine de Mateur' }, { label: 'Connexion', value: 'Rail & Autoroute' }],
    prompt: "Futuristic agricultural logistics hub in Mateur, smart storage facilities, autonomous cargo trains loading fresh produce, bright sunny day, highly detailed."
  },
  {
    id: 'p11', title: 'Parc de Loisirs (Berges Sud)', theme: THEMES.GREEN,
    lat: 37.139154, lng: 9.871864, icon: <Waves className="w-5 h-5" />,
    problem: "Manque d'espaces d'animation sur les rives sud du lac.",
    vision: "Station de sports nautiques et espaces d'éco-tourisme de niveau international.",
    stats: [{ label: 'Localisation', value: 'Tinja / M. Bourguiba' }, { label: 'Vocation', value: 'Éco-tourisme & Loisirs' }],
    prompt: "Eco-tourism leisure park on the southern shores of Bizerte lake, people doing water sports, green nature, sustainable wooden architecture, sunny day, 8k."
  },
  {
    id: 'p12', title: 'Réhabilitation de la Corniche', theme: THEMES.BLUE,
    lat: 37.304765, lng: 9.868003, icon: <Waves className="w-5 h-5" />,
    problem: "Érosion marine menaçant l'infrastructure de la plage nord.",
    vision: "Réhabilitation sur 5 km avec solutions basées sur la nature et promenade résiliente.",
    stats: [{ label: 'Localisation', value: 'La Corniche' }, { label: 'Linéaire', value: '5 km' }],
    prompt: "A beautifully rehabilitated coastal promenade in Bizerte, resilient infrastructure against sea erosion, people walking, sunset, hyper-realistic."
  },
  {
    id: 'p13', title: 'Zone Touristique Sidi Salem', theme: THEMES.BLUE,
    lat: 37.281301, lng: 9.879457, icon: <Building2 className="w-5 h-5" />,
    problem: "Manque d'infrastructures hôtelières intra-urbaines pour le tourisme d'affaires.",
    vision: "Zone intégrée de 23 hectares offrant des hôtels de haut standing face à la mer.",
    stats: [{ label: 'Localisation', value: 'Sidi Salem' }, { label: 'Superficie', value: '23 Hectares' }],
    prompt: "Luxury eco-friendly hotels in Sidi Salem Bizerte, modern beachfront architecture, smart city integration, green roofs, beautiful Mediterranean sea."
  },
  {
    id: 'p14', title: 'Gare Multimodale & RFR', theme: THEMES.INFRA,
    lat: 37.240594, lng: 9.889003, icon: <MapPin className="w-5 h-5" />,
    problem: "Mauvaise connexion entre les modes de transport desservant les pôles économiques.",
    vision: "Gare moderne reliant Réseau Ferré Rapide (RFR), bus et mobilités douces.",
    stats: [{ label: 'Localisation', value: 'Zarzouna / Pôle' }, { label: 'Impact', value: 'Mobilité durable' }],
    prompt: "Futuristic multimodal train station in Bizerte, high speed train arriving, glass and steel architecture, solar panels, people commuting, sunny."
  },
  {
    id: 'p15', title: 'Protection contre inondation', theme: THEMES.GREEN,
    lat: 37.237800, lng: 9.913678, icon: <Waves className="w-5 h-5" />,
    problem: "Risque d'inondation de la ville de Menzel Jemil et de sa zone industrielle par les eaux de ruissellement et le débordement de l'oued.",
    vision: "Aménagement d'ouvrages de protection, de canaux d'évacuation et renforcement du réseau d'assainissement.",
    stats: [{ label: 'Localisation', value: 'Menzel Jemil' }, { label: 'Objectif', value: 'Sécurisation urbaine' }],
    prompt: "Advanced flood protection infrastructure in an industrial zone, green drainage channels, smart water management systems, modern city, 8k render."
  },
  {
    id: 'p16', title: 'Assainissement', theme: THEMES.GREEN,
    lat: 37.260038, lng: 9.773050, icon: <Factory className="w-5 h-5" />,
    problem: "Capacité insuffisante face à la croissance urbaine et pollution du lac.",
    vision: "Extension de la station pour une dépollution durable et respectueuse de l'écosystème.",
    stats: [{ label: 'Localisation', value: 'Bizerte Sud' }, { label: 'Action', value: 'Dépollution' }],
    prompt: "A high-tech green water sanitation and treatment plant, modern eco-friendly industrial architecture, clean water discharge, drone view."
  },
  {
    id: 'p17', title: 'Parc Zoologique Nadhour', theme: THEMES.GREEN,
    lat: 37.320851, lng: 9.841820, icon: <Leaf className="w-5 h-5" />,
    problem: "Manque d'espaces de loisirs familiaux et de lieux d'éducation environnementale.",
    vision: "Réhabilitation d'un parc zoologique et botanique moderne, axé sur le bien-être animal au cœur de la forêt de Nadhour.",
    stats: [{ label: 'Localisation', value: 'Nadhour' }, { label: 'Vocation', value: 'Éducation & Loisirs' }],
    prompt: "A modern eco-friendly zoological and botanical park, lush green forest, natural animal habitats, sustainable wooden walkways, families visiting, bright day."
  },
  {
    id: 'p18', title: 'Gestion Durable des Déchets', theme: THEMES.GREEN,
    lat: null, lng: null, icon: <Globe className="w-5 h-5" />, 
    problem: "Le manque d'une plateforme centralisée de données entrave la prise de décision stratégique à l'échelle globale du gouvernorat.",
    vision: "Création d'un Jumeau Numérique (Digital Twin) du Grand Bizerte et d'un centre de commandement IA pour anticiper les crises et gérer les ressources en temps réel.",
    stats: [{ label: 'Impact', value: 'Transverse' }, { label: 'Échelle', value: 'Régionale' }],
    prompt: "A futuristic glowing holographic map of a whole region, digital twin technology, smart city data visualization, dark background, 8k, highly detailed."
  }
];

// --- COMPOSANT PRINCIPAL ---
export default function App() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeTheme, setActiveTheme] = useState(THEMES.ALL.id);
  const [showHackathonInfo, setShowHackathonInfo] = useState(false);
  
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const filteredProjects = activeTheme === THEMES.ALL.id 
    ? PROJECTS 
    : PROJECTS.filter(p => p.theme.id === activeTheme);

  // --- INITIALISATION DE LEAFLET AVEC OPEN TOPO MAP ---
  useEffect(() => {
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    if (!document.getElementById('leaflet-js')) {
      const script = document.createElement('script');
      script.id = 'leaflet-js';
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = initOSMMap;
      document.head.appendChild(script);
    } else {
      if (window.L) initOSMMap();
      else document.getElementById('leaflet-js').addEventListener('load', initOSMMap);
    }

    function initOSMMap() {
      if (!mapRef.current || mapInstance.current || !window.L) return;

      const map = window.L.map(mapRef.current, {
        center: [37.15, 9.60],
        zoom: 10,
        zoomControl: false // On désactive pour avoir un look plus épuré
      });

      window.L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Limites de déplacement (Périmètre du gouvernorat de Bizerte)
      const bounds = window.L.latLngBounds([36.75, 8.90], [37.45, 10.30]);
      map.setMaxBounds(bounds);
      map.on('drag', function() { map.panInsideBounds(bounds, { animate: false }); });

      // Calque OpenTopoMap
      window.L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        maxZoom: 17,
        minZoom: 9,
        attribution: 'Map data: &copy; OpenStreetMap contributors | Map style: &copy; OpenTopoMap'
      }).addTo(map);

      mapInstance.current = map;

      // Déplacer le conteneur React des pins à l'intérieur du panneau de marqueurs de Leaflet
      const pinsContainer = document.getElementById('react-pins-container');
      if (pinsContainer) {
        map.getPanes().markerPane.appendChild(pinsContainer);
      }

      // Fonction pour calculer les positions exactes pendant l'animation de zoom
      const updateReactPins = (animateEvent) => {
        PROJECTS.forEach(p => {
          if (!p.lat || !p.lng) return; 
          
          const el = document.getElementById(`leaflet-marker-${p.id}`);
          if (el && mapInstance.current) {
            let pt;
            if (animateEvent && animateEvent.type === 'zoomanim') {
              pt = mapInstance.current._latLngToNewLayerPoint([p.lat, p.lng], animateEvent.zoom, animateEvent.center);
              el.style.transition = 'transform 0.25s cubic-bezier(0,0,0.25,1)';
            } else {
              pt = mapInstance.current.latLngToLayerPoint([p.lat, p.lng]);
              el.style.transition = 'none';
            }
            el.style.transform = `translate3d(${pt.x}px, ${pt.y}px, 0) translate(-50%, -50%)`;
            el.style.opacity = '1';
          }
        });
      };

      map.on('move zoom zoomanim zoomend viewreset', updateReactPins);
      
      setTimeout(() => updateReactPins(), 100);
      setMapLoaded(true);
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // --- RECENTRAGE DE LA CAMÉRA ---
  useEffect(() => {
    if (selectedProject && mapInstance.current) {
      if (selectedProject.lat && selectedProject.lng) {
        mapInstance.current.flyTo([selectedProject.lat, selectedProject.lng], 14, { duration: 1.5 });
      } else {
        mapInstance.current.flyTo([37.15, 9.60], 10, { duration: 1.5 });
      }
    }
  }, [selectedProject]);

  // --- ACTUALISATION DES PINS LORS DU FILTRAGE ---
  useEffect(() => {
    if (mapLoaded && mapInstance.current) {
      setTimeout(() => {
        PROJECTS.forEach(p => {
          if (!p.lat || !p.lng) return;
          const el = document.getElementById(`leaflet-marker-${p.id}`);
          if (el && mapInstance.current) {
            const pt = mapInstance.current.latLngToLayerPoint([p.lat, p.lng]);
            el.style.transition = 'none';
            el.style.transform = `translate3d(${pt.x}px, ${pt.y}px, 0) translate(-50%, -50%)`;
            el.style.opacity = '1';
          }
        });
      }, 50);
    }
  }, [activeTheme, mapLoaded]);

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-800 font-sans overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: globalStyles }} />
      
      {/* --- COLONNE GAUCHE / CARTE --- */}
      <div className={`relative flex flex-col h-full transition-all duration-500 ease-in-out ${selectedProject ? 'w-2/3' : 'w-full'}`}>
        
        {/* En-tête / Filtres */}
        <div className="absolute top-0 left-0 w-full z-40 p-6 flex justify-between items-start pointer-events-none">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3 drop-shadow-sm">
              <Layers className="text-blue-600 w-8 h-8" />
              Bizerte AI Design Lab <span className="text-blue-600 font-light">| Topographie</span>
            </h1>
            <div className="flex flex-wrap gap-3 mt-2 pointer-events-auto">
              <p className="text-slate-600 font-medium bg-white/90 backdrop-blur-md inline-flex items-center px-3 py-1.5 rounded-md border border-slate-200 shadow-sm text-sm">
                Édition 2026 : Horizon Bizerte 2050
              </p>
              <button 
                onClick={() => setShowHackathonInfo(true)}
                className="text-blue-700 font-bold bg-blue-100 hover:bg-blue-200 backdrop-blur-md inline-flex items-center gap-2 px-4 py-1.5 rounded-md border border-blue-200 shadow-sm transition-colors cursor-pointer text-sm"
              >
                <Info className="w-4 h-4" /> Règlement & Détails du Hackathon
              </button>
            </div>
          </div>
          
          <div className="flex flex-col gap-2 items-end pointer-events-auto mt-2 lg:mt-0">
            {Object.values(THEMES).map(theme => (
              <button
                key={theme.id}
                onClick={() => {
                  setActiveTheme(theme.id);
                  if (selectedProject && selectedProject.theme.id !== theme.id && theme.id !== THEMES.ALL.id) {
                    setSelectedProject(null);
                  }
                }}
                className={`px-4 py-2 text-sm font-semibold rounded-full border transition-all shadow-sm ${
                  activeTheme === theme.id 
                    ? theme.color + ' ring-2 ring-slate-400/20 scale-105' 
                    : 'bg-white/90 border-slate-200 text-slate-600 hover:bg-slate-50'
                } backdrop-blur-md`}
              >
                {theme.label}
              </button>
            ))}
          </div>
        </div>

        {/* --- ZONE DE LA CARTE OPEN TOPO MAP --- */}
        <div className="absolute inset-0 w-full h-full bg-slate-200 overflow-hidden z-20 pointer-events-auto">
          
          {/* --- MINI-MAP DE LA TUNISIE --- */}
          <div className="absolute left-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center z-30 pointer-events-auto">
            <div className="bg-white/80 backdrop-blur-xl p-5 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-200/60 flex flex-col items-center">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-200 pb-2 w-full text-center">
                Situation Nationale
              </h3>
              <div className="relative w-28 h-56 flex items-center justify-center">
                <img 
                  src="https://commons.wikimedia.org/wiki/Special:FilePath/Tunisia_location_map.svg" 
                  alt="Carte de la Tunisie"
                  className="w-full h-full object-contain opacity-60 pointer-events-none"
                  style={{ filter: 'grayscale(100%) contrast(1.5)' }}
                />
                <div className="absolute top-[5%] left-[53%] flex items-center justify-center group cursor-pointer">
                  <span className="absolute w-6 h-6 bg-blue-500/40 rounded-full animate-ping"></span>
                  <div className="w-2.5 h-2.5 bg-blue-600 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.8)] border border-white"></div>
                  <div className="absolute left-full ml-3 bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                    Gouvernorat de Bizerte
                    <div className="absolute top-1/2 -left-1 -mt-1 border-4 border-transparent border-r-slate-800"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* --- FIN MINI-MAP --- */}

          {/* --- PROJETS TRANSVERSES (NON GÉOLOCALISÉS) --- */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 flex gap-3 pointer-events-auto">
            {filteredProjects.filter(p => !p.lat || !p.lng).map(project => (
              <button
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className={`flex items-center gap-3 px-4 py-3 bg-white/95 backdrop-blur-md border ${selectedProject?.id === project.id ? 'border-blue-500 ring-2 ring-blue-500/30' : 'border-slate-200'} rounded-2xl shadow-xl hover:-translate-y-1 transition-all duration-300`}
              >
                <div 
                  className={`p-2 rounded-xl text-white`} 
                  style={{ backgroundColor: selectedProject?.id === project.id ? project.theme.hex : '#94a3b8' }}
                >
                  {project.icon}
                </div>
                <div className="text-left">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Projet Transverse</div>
                  <div className="text-sm font-bold text-slate-800 leading-none">{project.title}</div>
                </div>
              </button>
            ))}
          </div>

          {/* DIV Cible pour Leaflet */}
          <div ref={mapRef} className="absolute inset-0 w-full h-full z-0"></div>

          {/* Conteneur des Pins */}
          <div id="react-pins-container" className="absolute top-0 left-0 z-50">
            {mapLoaded && filteredProjects.filter(p => p.lat && p.lng).map((project) => {
              const isSelected = selectedProject?.id === project.id;
              
              return (
                <button
                  key={`leaflet-${project.id}`}
                  id={`leaflet-marker-${project.id}`}
                  onClick={() => setSelectedProject(project)}
                  style={{ top: 0, left: 0, opacity: 0 }} 
                  className="absolute group outline-none pointer-events-auto"
                >
                  {isSelected && (
                    <span 
                      className="absolute inset-0 rounded-full animate-ping opacity-50"
                      style={{ backgroundColor: project.theme.hex }}
                    ></span>
                  )}
                  
                  <div 
                    className={`relative flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full border-2 transition-all duration-300 shadow-lg
                      ${isSelected ? 'scale-110' : 'hover:scale-110'}
                    `}
                    style={{
                      backgroundColor: isSelected ? project.theme.hex : 'white',
                      borderColor: isSelected ? 'white' : project.theme.hex,
                      color: isSelected ? 'white' : project.theme.hex,
                      boxShadow: isSelected ? `0 10px 20px ${project.theme.hex}60` : '0 4px 10px rgba(0,0,0,0.15)'
                    }}
                  >
                    {project.icon}
                  </div>
                  
                  <div 
                    className={`absolute top-full mt-3 left-1/2 transform -translate-x-1/2 whitespace-nowrap px-3 py-1.5 rounded-lg text-sm font-bold border transition-all duration-300 shadow-lg bg-white/95 backdrop-blur-md
                      ${isSelected ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'}
                      pointer-events-none
                    `}
                    style={{ borderColor: project.theme.hex, color: '#0f172a' }}
                  >
                    {project.title}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* --- PANNEAU LATÉRAL DROIT / DÉTAILS DU PROJET --- */}
      <div 
        className={`absolute top-0 right-0 h-full bg-white/95 backdrop-blur-2xl border-l border-slate-200 shadow-2xl transition-transform duration-500 ease-in-out z-50 flex flex-col
          ${selectedProject ? 'translate-x-0 w-1/3' : 'translate-x-full w-1/3'}
        `}
      >
        {selectedProject && (
          <>
            <div className="flex justify-between items-start p-6 border-b border-slate-100">
              <div className={`p-3 rounded-xl border ${selectedProject.theme.color}`}>
                {selectedProject.icon}
              </div>
              <button 
                onClick={() => {
                  setSelectedProject(null);
                  if(mapInstance.current) {
                    mapInstance.current.flyTo([37.15, 9.60], 10, { duration: 1 });
                  }
                }}
                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              <div>
                <span className={`inline-flex px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border ${selectedProject.theme.color} mb-4 shadow-sm`}>
                  {selectedProject.theme.label}
                </span>
                <h2 className="text-3xl font-bold text-slate-900 mb-2 leading-tight">
                  {selectedProject.title}
                </h2>
                <div className="flex items-center text-slate-500 text-sm gap-2 font-medium">
                  <MapPin className="w-4 h-4" /> Grand Bizerte
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {selectedProject.stats.map((stat, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200 p-4 rounded-xl shadow-sm">
                    <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">{stat.label}</div>
                    <div className="text-lg font-bold text-slate-800">{stat.value}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-6">
                <div className="relative pl-6 border-l-2 border-slate-300">
                  <div className="absolute -left-2 top-0 bg-slate-300 p-1 rounded-full"><Info className="w-3 h-3 text-slate-700" /></div>
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Le Défi Actuel</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {selectedProject.problem}
                  </p>
                </div>
                
                <div className="relative pl-6 border-l-2" style={{ borderColor: selectedProject.theme.hex }}>
                  <div className="absolute -left-2 top-0 p-1 rounded-full shadow-md" style={{ backgroundColor: selectedProject.theme.hex }}><TrendingUp className="w-3 h-3 text-white" /></div>
                  <h3 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: selectedProject.theme.hex }}>Vision 2050</h3>
                  <p className="text-slate-800 text-sm leading-relaxed font-medium">
                    {selectedProject.vision}
                  </p>
                </div>
              </div>

              <div className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 p-4 opacity-10"><Sparkles className="w-24 h-24 text-blue-400" /></div>
                <h3 className="flex items-center gap-2 text-blue-400 font-bold mb-3 text-xs uppercase tracking-widest relative z-10">
                  <Sparkles className="w-4 h-4" /> Hub de Génération IA
                </h3>
                <p className="text-xs text-slate-400 mb-4 relative z-10">
                  Prompt d'inspiration recommandé pour les outils de génération d'images (Midjourney, DALL-E) :
                </p>
                <div className="bg-black/50 border border-slate-700/50 p-4 rounded-xl relative z-10">
                  <code className="text-sm text-blue-300 font-mono leading-relaxed select-all">
                    "{selectedProject.prompt}"
                  </code>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 bg-white/90 flex gap-4">
              <button className="flex-1 hover:bg-blue-700 bg-blue-600 text-white font-bold py-3 px-4 rounded-xl flex justify-center items-center gap-2 transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-0.5">
                <Map className="w-5 h-5" /> Ajouter à la trame vidéo
              </button>
            </div>
          </>
        )}
      </div>

      {/* --- MODALE : DÉTAILS DU HACKATHON --- */}
      {showHackathonInfo && (
        <div className="absolute inset-0 z-[60] bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 lg:p-6 pointer-events-auto">
          <div className="bg-white w-full max-w-6xl max-h-full rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300">
            
            {/* Header de la Modale */}
            <div className="bg-slate-900 text-white p-6 md:p-8 flex justify-between items-center shrink-0 border-b-4 border-blue-500">
              <div className="flex items-center gap-5">
                <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-600/30">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-black tracking-tight">Règlement Général du Hackathon</h2>
                  <p className="text-blue-300 font-medium text-sm md:text-base mt-1">Bizerte AI Design Lab - 1ère Édition : 15 & 16 Avril 2026</p>
                </div>
              </div>
              <button onClick={() => setShowHackathonInfo(false)} className="p-3 hover:bg-slate-800 rounded-full transition-colors bg-slate-800/50">
                <X className="w-6 h-6 text-slate-300 hover:text-white" />
              </button>
            </div>

            {/* Contenu de la Modale */}
            <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1 bg-slate-50/50">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* --- COLONNE GAUCHE : LOGISTIQUE & ORGANISATION --- */}
                <div className="space-y-6">
                  
                  <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="flex items-center gap-3 text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-3">
                      <BookOpen className="w-5 h-5 text-blue-600" /> Art 1. Objet et Contexte
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Le « Bizerte AI Design Lab » est un dispositif d'innovation organisé sous forme de hackathon intensif de 24h. Son objectif est de <strong className="text-slate-800">traduire visuellement la vision de développement territorial de Bizerte à l'horizon 2050</strong> en modélisant les recommandations institutionnelles en outils d'aide à la décision.
                    </p>
                  </section>

                  <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="flex items-center gap-3 text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-3">
                      <Users className="w-5 h-5 text-blue-600" /> Art 2. Participants & Équipes
                    </h3>
                    <ul className="space-y-3 text-slate-600 text-sm">
                      <li className="flex items-start gap-3"><CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" /> <div><strong>Effectif Total :</strong> 36 étudiants préalablement sélectionnés.</div></li>
                      <li className="flex items-start gap-3"><CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" /> <div><strong>Équipes :</strong> 6 groupes hétérogènes de 6 membres.</div></li>
                      <li className="flex items-start gap-3"><CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" /> <div><strong>Profils pluridisciplinaires :</strong> Ingénierie, architecture, design, urbanisme, data visualisation, et spécialistes IA/SIG.</div></li>
                    </ul>
                  </section>

                  <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="flex items-center gap-3 text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-3">
                      <Calendar className="w-5 h-5 text-blue-600" /> Art 3. Déroulement (Format 24H)
                    </h3>
                    <div className="space-y-4 text-sm text-slate-600 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                      <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-white bg-slate-200 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10"></div>
                        <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] bg-slate-50 p-3 rounded-xl border border-slate-200">
                          <span className="font-bold text-blue-700 block mb-1">Jour 1 (15 Avril)</span>
                          <strong>Imprégnation :</strong> Ateliers avec experts et ministères. Collecte des données techniques.
                        </div>
                      </div>
                      <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-white bg-blue-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10"></div>
                        <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                          <span className="font-bold text-blue-700 block mb-1">Jour 2 - 14h00</span>
                          <strong>Clôture :</strong> Fin stricte du hackathon et soumission des livrables.
                        </div>
                      </div>
                      <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-white bg-emerald-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10"></div>
                        <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                          <span className="font-bold text-emerald-700 block mb-1">Jour 2 - 15h00+</span>
                          <strong>Délibération :</strong> Pitch final (15h) puis Remise des prix (17h).
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="flex items-center gap-3 text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-3">
                      <Wrench className="w-5 h-5 text-blue-600" /> Art 5. Modalités Techniques
                    </h3>
                    <p className="text-sm text-slate-600 mb-3">
                      L'organisation fournira une connectivité stable et l'accès aux licences IA. Les étudiants doivent se munir de laptops haute performance.
                    </p>
                    <div className="bg-amber-50 border-l-4 border-amber-400 p-3 text-xs text-amber-800 rounded-r-lg">
                      <strong>Attention :</strong> Toutes les productions (images, vidéos, musiques) doivent être originales, générées par IA, ou strictement libres de droits. Des coachs techniques vérifieront la rigueur institutionnelle.
                    </div>
                  </section>
                  
                  <section className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-md text-slate-300">
                    <h3 className="flex items-center gap-3 text-lg font-bold text-white mb-3 border-b border-slate-600 pb-3">
                      <ShieldCheck className="w-5 h-5 text-emerald-400" /> Art 8. Propriété Intellectuelle
                    </h3>
                    <p className="text-sm leading-relaxed">
                      Les travaux produits ont vocation à alimenter le prochain plan quinquennal de la région. Ils deviendront la propriété des instances organisatrices. Une charte de P.I. sera signée avant le Hackathon.
                    </p>
                  </section>

                </div>

                {/* --- COLONNE DROITE : LE DÉFI & ÉVALUATION --- */}
                <div className="space-y-6">
                  
                  <section className="bg-gradient-to-br from-blue-900 to-indigo-900 p-6 md:p-8 rounded-2xl border border-indigo-700 shadow-lg text-white">
                    <h3 className="flex items-center gap-3 text-xl font-bold text-blue-300 mb-4 border-b border-indigo-700/50 pb-3">
                      <FileVideo className="w-6 h-6" /> Art 4. Le Défi & Livrable
                    </h3>
                    <p className="text-sm text-indigo-100 mb-5 leading-relaxed font-medium">
                      Soumission d'une <strong className="text-white text-base">vidéo 3D de 10 à 15 minutes</strong> maximum, scénarisée obligatoirement comme suit :
                    </p>
                    <ul className="space-y-4 text-sm text-indigo-200 mb-6">
                      <li className="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
                        <span className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</span> 
                        <div><strong className="text-white block mb-1">Vue Macro :</strong> Représentation globale du Gouvernorat Bizerte à l'horizon 2050.</div>
                      </li>
                      <li className="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
                        <span className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</span> 
                        <div><strong className="text-white block mb-1">Vue Micro (Zoom-in) :</strong> Visite immersive détaillant géographiquement et thématiquement des zones spécifiques.</div>
                      </li>
                      <li className="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
                        <span className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</span> 
                        <div><strong className="text-white block mb-1">Projections et Impacts :</strong> Intégration des projets (viaduc, dépollution, marina...).</div>
                      </li>
                    </ul>
                    <div className="bg-indigo-950/50 p-4 rounded-xl border border-indigo-500/30 text-xs text-indigo-100">
                      <strong className="text-blue-300 block mb-1 uppercase tracking-wider">Ligne Éditoriale Exigée :</strong>
                      Créativité visuelle + Fidélité absolue aux contenus. Concepts basés sur des <strong className="text-white">chiffres réels et sources validées</strong>. Vision résiliente, verte et inclusive.
                    </div>
                  </section>

                  <section className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="flex items-center justify-between text-xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-3"><Target className="w-6 h-6 text-blue-600" /> Art 6. Grille d'Évaluation</div>
                      <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-black">/ 20 POINTS</span>
                    </h3>
                    
                    <div className="space-y-5">
                      <div className="group">
                        <div className="flex justify-between items-end mb-1">
                          <span className="font-bold text-slate-700 text-sm">1. Innovation & Créativité</span>
                          <span className="text-blue-600 font-bold text-sm">5 pts</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2.5 rounded-full mb-2 overflow-hidden"><div className="bg-blue-500 h-full rounded-full w-1/4 group-hover:w-full transition-all duration-1000"></div></div>
                        <p className="text-xs text-slate-500 leading-snug">Originalité de la vision, esthétique de la vidéo, maîtrise des outils IA.</p>
                      </div>
                      
                      <div className="group">
                        <div className="flex justify-between items-end mb-1">
                          <span className="font-bold text-slate-700 text-sm">2. Résilience Climatique</span>
                          <span className="text-emerald-600 font-bold text-sm">4 pts</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2.5 rounded-full mb-2 overflow-hidden"><div className="bg-emerald-500 h-full rounded-full w-1/5 group-hover:w-[80%] transition-all duration-1000"></div></div>
                        <p className="text-xs text-slate-500 leading-snug">Adaptation aux inondations, érosion. Résilience des infrastructures.</p>
                      </div>
                      
                      <div className="group">
                        <div className="flex justify-between items-end mb-1">
                          <span className="font-bold text-slate-700 text-sm">3. Écologie & Environnement</span>
                          <span className="text-emerald-600 font-bold text-sm">4 pts</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2.5 rounded-full mb-2 overflow-hidden"><div className="bg-emerald-500 h-full rounded-full w-1/5 group-hover:w-[80%] transition-all duration-1000"></div></div>
                        <p className="text-xs text-slate-500 leading-snug">Axes verts/bleus, économie circulaire, solutions fondées sur la nature.</p>
                      </div>
                      
                      <div className="group">
                        <div className="flex justify-between items-end mb-1">
                          <span className="font-bold text-slate-700 text-sm">4. Clarté Institutionnelle</span>
                          <span className="text-purple-600 font-bold text-sm">5 pts</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2.5 rounded-full mb-2 overflow-hidden"><div className="bg-purple-500 h-full rounded-full w-1/4 group-hover:w-full transition-all duration-1000"></div></div>
                        <p className="text-xs text-slate-500 leading-snug">Aide à la décision pour les élus. Chiffres exacts, dimensions réalistes, narration fluide.</p>
                      </div>
                      
                      <div className="group">
                        <div className="flex justify-between items-end mb-1">
                          <span className="font-bold text-slate-700 text-sm">5. Qualité du Pitch</span>
                          <span className="text-orange-600 font-bold text-sm">2 pts</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2.5 rounded-full mb-2 overflow-hidden"><div className="bg-orange-500 h-full rounded-full w-[10%] group-hover:w-[40%] transition-all duration-1000"></div></div>
                        <p className="text-xs text-slate-500 leading-snug">Respect de la durée (10-15min), capacité à argumenter face au jury mixte.</p>
                      </div>
                    </div>
                  </section>

                  <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="flex items-center gap-3 text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-3">
                      <Trophy className="w-5 h-5 text-yellow-500" /> Art 7. Prix & Récompenses
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                      <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-xl text-center">
                        <div className="font-black text-lg text-yellow-700">1er Prix</div>
                        <div className="font-bold text-yellow-800">3000 DT</div>
                        <div className="text-[10px] text-yellow-600/80 uppercase mt-1">500 DT / étudiant</div>
                      </div>
                      <div className="bg-slate-100 border border-slate-300 p-3 rounded-xl text-center">
                        <div className="font-black text-lg text-slate-600">2e Prix</div>
                        <div className="font-bold text-slate-700">1800 DT</div>
                        <div className="text-[10px] text-slate-500 uppercase mt-1">300 DT / étudiant</div>
                      </div>
                      <div className="bg-orange-50 border border-orange-200 p-3 rounded-xl text-center">
                        <div className="font-black text-lg text-orange-700">3e Prix</div>
                        <div className="font-bold text-orange-800">1200 DT</div>
                        <div className="text-[10px] text-orange-600/80 uppercase mt-1">200 DT / étudiant</div>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 p-2 rounded-xl text-center">
                        <div className="font-bold text-slate-500">4e : 900 DT</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">150 DT / étud.</div>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 p-2 rounded-xl text-center">
                        <div className="font-bold text-slate-500">5e : 750 DT</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">125 DT / étud.</div>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 p-2 rounded-xl text-center">
                        <div className="font-bold text-slate-500">6e : 600 DT</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">100 DT / étud.</div>
                      </div>
                    </div>
                  </section>

                </div>

              </div>
            </div>
            
            {/* Footer Modale */}
            <div className="bg-slate-100 p-4 text-center border-t border-slate-200 shrink-0">
              <p className="text-xs text-slate-500 font-medium">Bizerte AI Design Lab © 2026 - Hackathon Officiel pour l'aménagement du territoire.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
