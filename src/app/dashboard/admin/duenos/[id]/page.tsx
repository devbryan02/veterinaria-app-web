import { DuenoProvider } from '@/src/features/veterinaria-dashboard/duenos/context/DuenoContext';
import DuenoPageDetails from '@/src/features/veterinaria-dashboard/duenos/components/DuenoPageDetails';

function DuenoPageDetailsHome() {
    return (
        <DuenoProvider>
            <DuenoPageDetails />
        </DuenoProvider>
    );
}

export default DuenoPageDetailsHome;