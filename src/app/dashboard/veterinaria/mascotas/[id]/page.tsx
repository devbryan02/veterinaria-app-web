import { MascotaProvider } from '@/src/features/vet-dashboard/mascotas/context/MascotaContext';
import MascotaPageDetails from '@/src/features/vet-dashboard/mascotas/components/MascotaPageDetails';

function MascotaPageHome() {
    return (
        <MascotaProvider>
            <MascotaPageDetails />
        </MascotaProvider>
    );
}

export default MascotaPageHome;