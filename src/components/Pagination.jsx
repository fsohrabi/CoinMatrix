export default function Pagination({ currentPage, totalPages, onPageChange }) {
    const generatePageNumbers = () => {
        const pages = [];
        const startPage = Math.max(1, currentPage - 2);
        const endPage = Math.min(totalPages, currentPage + 2);

        if (startPage > 1) pages.push("...");
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        if (endPage < totalPages) pages.push("...");

        return pages;
    };

    const pageNumbers = generatePageNumbers();

    return (
        <div className="join  mt-5 mb-3 flex justify-center space-x-2">
            {/* Previous Button */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="btn btn-square bg-[#f6f8fe]"
            >
                &lt;
            </button>

            {/* First Page */}
            <button
                onClick={() => onPageChange(1)}
                className={`btn btn-square bg-[#f6f8fe] ${currentPage === 1 ? "bg-blue-500 text-white" : ""}`}
            >
                1
            </button>

            {/* Ellipsis Before Middle Pages */}
            {currentPage > 3 && <span className="text-gray-500">...</span>}

            {/* Dynamic Middle Pages */}
            {pageNumbers
                .filter((page) => typeof page === "number" && page > 1 && page < totalPages)
                .map((page) => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`btn btn-square bg-[#f6f8fe] ${currentPage === page ? "bg-blue-500 text-white" : ""}`}
                    >
                        {page}
                    </button>
                ))}

            {/* Ellipsis After Middle Pages */}
            {currentPage < totalPages - 2 && <span className="text-gray-500">...</span>}

            {/* Last Page */}
            {totalPages > 1 && (
                <button
                    onClick={() => onPageChange(totalPages)}
                    className={`btn btn-square bg-[#f6f8fe] ${currentPage === totalPages ? "bg-blue-500 text-white" : ""}`}
                >
                    {totalPages}
                </button>
            )}

            {/* Next Button */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="btn btn-square bg-[#f6f8fe]"
            >
                &gt;
            </button>
        </div>
    );
}
