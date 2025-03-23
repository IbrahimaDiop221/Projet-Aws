'use client';

import Container from "@/app/components/Container";
import { TbBeach, TbMountain, TbPool } from "react-icons/tb";
import {
    GiBarn,
    GiBoatFishing,
    GiCactus,
    GiCastle,
    GiCaveEntrance,
    GiForestCamp,
    GiIsland,
    GiWindmill
} from "react-icons/gi";
import { MdOutlineVilla } from "react-icons/md";
import CategoryBox from "@/app/components/CategoryBox";
import { usePathname, useSearchParams } from "next/navigation";
import { FaSkiing } from "react-icons/fa";
import { BsSnow } from "react-icons/bs";
import { IoDiamond } from "react-icons/io5";

export const categories = [
    {
        label: 'Plage',
        icon: TbBeach,
        description: 'Cette propriété est proche de la plage !'
    },
    {
        label: 'Moulins à vent',
        icon: GiWindmill,
        description: 'Cette propriété possède des moulins à vent !'
    },
    {
        label: 'Moderne',
        icon: MdOutlineVilla,
        description: 'Cette propriété est moderne !'
    },
    {
        label: 'Campagne',
        icon: TbMountain,
        description: 'Cette propriété est à la campagne !'
    },
    {
        label: 'Piscines',
        icon: TbPool,
        description: 'Cette propriété possède une piscine !'
    },
    {
        label: 'Îles',
        icon: GiIsland,
        description: 'Cette propriété est sur une île !'
    },
    {
        label: 'Lac',
        icon: GiBoatFishing,
        description: 'Cette propriété est proche d’un lac !'
    },
    {
        label: 'Ski',
        icon: FaSkiing,
        description: 'Cette propriété propose des activités de ski !'
    },
    {
        label: 'Châteaux',
        icon: GiCastle,
        description: 'Cette propriété est dans un château !'
    },
    {
        label: 'Camping',
        icon: GiForestCamp,
        description: 'Cette propriété propose des activités de camping !'
    },
    {
        label: 'Arctique',
        icon: BsSnow,
        description: 'Cette propriété est dans une région arctique !'
    },
    {
        label: 'Grotte',
        icon: GiCaveEntrance,
        description: 'Cette propriété est dans une grotte !'
    },
    {
        label: 'Désert',
        icon: GiCactus,
        description: 'Cette propriété est dans le désert !'
    },
    {
        label: 'Granges',
        icon: GiBarn,
        description: 'Cette propriété est dans une grange !'
    },
    {
        label: 'Luxe',
        icon: IoDiamond,
        description: 'Cette propriété est luxueuse !'
    },
];
const Categories = () => {
    const params = useSearchParams();
    const category = params?.get('category');
    const pathname = usePathname();

    const isMainPage = pathname === '/';

    if(!isMainPage) {
        return null;
    }

    return (
        <Container>
            <div className="pt-4 flex flex-row items-center justify-between overflow-x-auto">
                {categories.map((item) => (
                    <CategoryBox
                        key={item.label}
                        label={item.label}
                        selected={category === item.label}
                        icon={item.icon}
                    />
                ))}
            </div>
        </Container>
    )
}

export default Categories;