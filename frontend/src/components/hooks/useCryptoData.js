import { useState, useEffect, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCryptosAPI, searchCryptosAPI } from "../api/crypto";

export function useCryptoData(currentPage, searchQuery, itemsPerPage) {
    const [totalPages, setTotalPages] = useState(1);

    // Paginated data query for initial view
    const {
        data: paginatedCryptoData,
        isLoading: isFetchingPaginated,
        isError: isErrorPaginated,
        error: errorPaginated,
    } = useQuery({
        queryKey: ["paginatedCryptoData", currentPage],
        queryFn: () => fetchCryptosAPI(currentPage, itemsPerPage),
        staleTime: 60000,  // optional: consider data fresh for 60s
        refetchInterval: 60000,  // ⏱ refetch every 60 seconds
        onSuccess: (data) => {
            if (!searchQuery.trim()) {
                setTotalPages(Math.ceil(data.total / itemsPerPage) || 1);
            }
        }
    });

    // Search query
    const {
        data: searchResults,
        isLoading: isSearching,
        isError: isErrorSearch,
        error: errorSearch,
    } = useQuery({
        queryKey: ["searchResults", searchQuery],
        queryFn: () => searchCryptosAPI(searchQuery),
        enabled: !!searchQuery.trim(), // Enable when there is a search query
        onSuccess: (data) => {
            if (searchQuery.trim()) {
                setTotalPages(Math.ceil(data.total / itemsPerPage) || 1);
            }
        }
    });

    // Determine the data to display
    const currentData = useMemo(() => {
        if (searchQuery.trim()) {
            return searchResults?.data.data || [];
        } else if (paginatedCryptoData?.data) {
            return paginatedCryptoData.data.data || [];
        }
        return [];
    }, [searchQuery, searchResults?.data, paginatedCryptoData?.data]);

    // Paginate the current data
    const paginatedData = useMemo(() => {
        if (searchQuery.trim()) {
            return currentData;
        }
        return currentData.slice(0, itemsPerPage);
    }, [currentPage, currentData, itemsPerPage]);

    // Calculate total pages
    useEffect(() => {
        if (searchQuery.trim()) {
            setTotalPages(Math.ceil(searchResults?.total / itemsPerPage) || 1);
        } else if (paginatedCryptoData?.total) {
            setTotalPages(Math.ceil(paginatedCryptoData.total / itemsPerPage) || 1);
        }
    }, [searchQuery, searchResults?.total, paginatedCryptoData?.total, itemsPerPage]);

    return {
        currentData,
        totalPages,
        paginatedData,  // Make sure this is returned
        isLoading: isFetchingPaginated || isSearching,
        isError: isErrorPaginated || isErrorSearch,
        error: isErrorSearch ? errorSearch : errorPaginated,
    };
}
