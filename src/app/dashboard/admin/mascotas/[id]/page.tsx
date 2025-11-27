import { MascotaProvider } from '@/src/features/veterinaria-dashboard/mascotas/context/MascotaContext';
import MascotaPageDetails from '@/src/features/veterinaria-dashboard/mascotas/components/MascotaPageDetails';

function MascotaPageHome() {
    return (
        <MascotaProvider>
            <MascotaPageDetails />
        </MascotaProvider>
    );
}

export default MascotaPageHome;