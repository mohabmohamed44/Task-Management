import {Button} from "@/presentation/components/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void; 
}

export default function Pagination({currentPage, totalPages, onPageChange}: PaginationProps) {
    const handlePrevious = () => {
        if(currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    return (
        <div className="flex items-center justify-center space-x-4">
            <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentPage === 1}
                aria-label="Previous page"
                aria-required="true"
                aria-invalid={currentPage === 1}
                aria-describedby="previous-page-error"
                aria-pressed={currentPage === 1}
                name="previous-page"
                id="previous-page"
            >
                <ChevronLeft className="h-4 w-4 mr-2"/>
                Previous
            </Button>
            <span className="text-sm font-medium">
                Page {currentPage} of {totalPages}
            </span>

            <Button variant="outline" onClick={handleNext} 
                disabled={currentPage === totalPages} 
                aria-label="Next page" 
                aria-required="true" 
                aria-invalid={currentPage === totalPages} 
                aria-describedby="next-page-error" 
                aria-pressed={currentPage === totalPages} 
                name="next-page" 
                id="next-page"
                >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
        </div>
    )
}