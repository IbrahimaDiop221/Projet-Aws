'use client';

import qs from "query-string";
import { useCallback, useMemo, useState } from "react";
import { Range } from "react-date-range";
import { useRouter, useSearchParams } from "next/navigation";
import { formatISO } from "date-fns";
import CountrySelect, { CountrySelectValue } from "@/app/components/inputs/CountrySelect";

import Modal from "@/app/components/modals/Modal";

import dynamic from "next/dynamic";
import useSearchModal from "@/app/hooks/useSearchModal";
import Heading from "@/app/components/Heading";
import Calendar from "@/app/components/inputs/Calendar";
import Counter from "@/app/components/inputs/Counter";

enum STEPS {
    LOCATION = 0,
    DATE = 1,
    INFO = 2
}

const SearchModal =  () => {
    const router = useRouter();
    const params = useSearchParams();
    const searchModal = useSearchModal();

    const [location, setLocation] = useState<CountrySelectValue>();

    const [step, setStep] = useState(STEPS.LOCATION);
    const [guestCount, setGuestCount] = useState(1);
    const [roomCount, setRoomCount] = useState(1);
    const [bathroomCount, setBathroomCount] = useState(1);
    const [dateRange, setDateRange] = useState<Range>({
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection'
    });

    const Map = useMemo(() => dynamic(() => import('../Map'),{
        ssr: false
    }),[location]);

    const onBack = useCallback(() => {
        setStep((value) => value - 1);
    }, []);


    const onNext = useCallback(() => {
        setStep((value) => value + 1);
    }, []);

    const onSubmit = useCallback(async () => {
        if(step !== STEPS.INFO) {
            return onNext();
        }

        let currentQuery = {};

        if(params) {
            currentQuery = qs.parse(params.toString())
        }

        const updatedQuery: any = {
            ...currentQuery,
            locationValue: location?.value,
            guestCount,
            roomCount,
            bathroomCount
        }

        if(dateRange.startDate) {
            updatedQuery.startDate = formatISO(dateRange.startDate);
        }

        if(dateRange.endDate) {
            updatedQuery.endDate = formatISO(dateRange.endDate);
        }

        const url = qs.stringifyUrl({
            url: '/',
            query: updatedQuery
        }, { skipNull: true });

        setStep(STEPS.LOCATION)
        searchModal.onClose();

        router.push(url)
    }, [step, searchModal, location, router, guestCount, roomCount, bathroomCount, dateRange, onNext, params]);

    const actionLabel = useMemo(() => {
        if(step === STEPS.INFO) {
            return 'Rechercher'
        }

        return 'Suivant'
    }, [step]);

    const secondayActionLabel = useMemo(() => {
        if(step === STEPS.LOCATION) {
            return undefined
        }

        return 'Retour'
    }, [step]);

    let bodyContent = (
        <div className="flex flex-col gap-8">
            <Heading
                title="Où voulez-vous aller ?"
                subTitle="Trouvez l'emplacement parfait !"
            />
            <CountrySelect
                value={location}
                onChange={(value) => setLocation(value as CountrySelectValue)}
            />
            <hr />

            <Map center={location?.latlng} />
        </div>
    );

    if(step === STEPS.DATE) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading
                    title="Quand prévoyez-vous de partir ?"
                    subTitle="Assurez-vous que tout le monde est disponible !"
                />

                <Calendar
                    value={dateRange}
                    onChange={(value) => setDateRange(value.selection)}
                />

            </div>
        )
    }

    if(step === STEPS.INFO) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading
                    title="Plus d'informations"
                    subTitle="Trouvez l'endroit parfait"
                />

                <Counter
                    title="Invités"
                    subtitle="Combien d'invités viennent ?"
                    value={guestCount}
                    onChange={(value) => setGuestCount(value)}
                />


                <Counter
                    title="Chambres"
                    subtitle="Combien de chambres avez-vous besoin ?"
                    value={roomCount}
                    onChange={(value) => setRoomCount(value)}
                />


                <Counter
                    title="Salles de bain"
                    subtitle="Combien de salles de bain avez-vous besoin ?"
                    value={bathroomCount}
                    onChange={(value) => setBathroomCount(value)}
                />


            </div>
        )
    }

    return (
        <Modal
            isOpen={searchModal.isOpen}
            onClose={searchModal.onClose}
            onSubmit={onSubmit}
            title="Filtres"
            actionLabel={actionLabel}
            secondaryActionLabel={secondayActionLabel}
            secondaryAction={step === STEPS.LOCATION ? undefined : onBack}
            body={bodyContent}
        />
    )
}

export default SearchModal;