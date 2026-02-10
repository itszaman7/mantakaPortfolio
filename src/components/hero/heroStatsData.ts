export interface StatsSlide {
    id: string;
    title: string;
    subtitle: string;
    highlight: string;
    suffix: string;
    description: string;
    image: string;
}

export const statsSlides: StatsSlide[] = [
    {
        id: "1",
        title: "Projects",
        subtitle: "Delivered",
        highlight: "270",
        suffix: "+",
        description:
            "Big stages, small details. Each one designed to leave a mark.",
        image:
            "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop",
    },
    {
        id: "2",
        title: "Loyal",
        subtitle: "Clients",
        highlight: "90",
        suffix: "%",
        description:
            "Our clients love to come back—proof that true partnership lasts.",
        image:
            "https://images.unsplash.com/photo-1519671482538-5810a2d468cd?q=80&w=2070&auto=format&fit=crop",
    },
    {
        id: "3",
        title: "Awards",
        subtitle: "Won",
        highlight: "15",
        suffix: "×",
        description:
            "Recognized globally for excellence in design and execution.",
        image:
            "https://images.unsplash.com/photo-1475721027760-f6c94c5387f9?q=80&w=2070&auto=format&fit=crop",
    },
    {
        id: "4",
        title: "Global",
        subtitle: "Reach",
        highlight: "31",
        suffix: "",
        description:
            "Countries—bringing the world to every event we produce.",
        image:
            "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=2050&auto=format&fit=crop",
    },
];
