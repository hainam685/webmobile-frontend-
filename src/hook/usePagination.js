import { useState } from "react";

const usePagination = (_data = [], itemsPerPage = 10) => {
    const [currentPage, setCurrentPage] = useState(1);

    const data = Array.isArray(_data) ? _data : [];

    const totalPages = Math.ceil(data.length / itemsPerPage);

    const currentData = data.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return {
        currentPage,
        totalPages,
        setCurrentPage,
        currentData,
    };
};

export default usePagination;
