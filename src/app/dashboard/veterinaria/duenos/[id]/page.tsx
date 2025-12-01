import { DuenoProvider } from '@/src/features/vet-dashboard/duenos/context/DuenoContext';
import DuenoPageDetails from '@/src/features/vet-dashboard/duenos/components/DuenoPageDetails';

function DuenoPageDetailsHome() {
    return (
        <DuenoProvider>
            <DuenoPageDetails />
        </DuenoProvider>
    );
}

export default DuenoPageDetailsHome;