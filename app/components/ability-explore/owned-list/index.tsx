"use client";
import { useEffect, useMemo, useState } from "react";
import { RiCloseLine } from "@remixicon/react";
import cn from "@/utils/classnames";
import Input from "@/app/components/base/input";
import Card from "./card";
import Empty from "./empty";
import { fetchHyydDataProvidersList } from "@/service/ability-explore";
import ExploreContext from "@/context/ability-explore-context";
import { useContext } from "use-context-selector";
import s from "../style.module.css";
import { useRouter } from "next/navigation";
import type { Collection } from "@/models/ability-explore";


const List = ({ className }: {className:string}) => {

    const [keywords, setKeywords] = useState<string>("");
    const handleKeywordsChange = (value: string) => {
        setKeywords(value);
    };
    const router = useRouter()
    const { activeTabItem } = useContext(ExploreContext);
    const [collectionList, setCollectionList] = useState<Collection[]>([]);
    const filteredCollectionList = useMemo(() => {
        return collectionList.filter((collection) => {
            if (keywords) {
                return collection.name.toLowerCase().includes(keywords.toLowerCase())
            }
            return true;
        });
    }, [keywords, collectionList]);
    const getProviderList = async () => {
        const list = await fetchHyydDataProvidersList()
        setCollectionList([...list]);
    };
    useEffect(() => {
        getProviderList();
    }, []);

    const [currentProvider, setCurrentProvider] = useState<
        Collection | undefined
    >();
    useEffect(() => {
        if (currentProvider && collectionList.length > 0) {
            const newCurrentProvider = collectionList.find(
                (collection) => collection.id === currentProvider.id
            );
            setCurrentProvider(newCurrentProvider);
        }
    }, [collectionList, currentProvider]);

    return (
        <div className={cn("flex h-full relative overflow-hidden bg-gray-100 shrink-0 grow", className)}>
            <div className="relative flex flex-col overflow-y-auto bg-gray-100 grow mb-1">
                <div
                    className={cn(
                        "sticky top-0 flex flex-col pt-4 px-12 pb-2 leading-[56px] bg-gray-100 z-20 flex-wrap gap-y-2",
                        currentProvider && "pr-6"
                    )}
                >
                    <div
                        className={
                            "mb-1 text-xl font-semibold items-center justify-between flex flex-1"
                        }
                    >
                        <span className={s.textGradient}>{activeTabItem?.mainTitle}</span>
                        <div className="flex items-center gap-2">
                            <Input
                                showLeftIcon
                                showClearIcon
                                wrapperClassName="w-[200px]"
                                value={keywords}
                                onChange={(e) => handleKeywordsChange(e.target.value)}
                                onClear={() => handleKeywordsChange("")}
                            />
                        </div>
                    </div>
                    <div className="text-gray-500 text-sm">{activeTabItem?.desc}</div>
                </div>
                <div
                    className={cn(
                        "relative grid content-start grid-cols-1 gap-4 px-12 pt-2 pb-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 grow shrink-0",
                        currentProvider &&
                        "pr-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                    )}
                >
                    {filteredCollectionList.map((collection) => (
                        <Card
                            active={currentProvider?.id === collection.id}
                            onSelect={() => { 
                                router.push(`/ability-explore/owned/${collection.id}?type=owned`)
                            }}
                            key={collection.id}
                            collection={collection}
                        />
                    ))}
                    {!filteredCollectionList.length && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            <Empty />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
List.displayName = "AbilityExploreList";
export default List;
