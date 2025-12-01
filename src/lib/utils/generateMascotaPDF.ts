import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import { MascotaPageDetails } from '@/src/features/vet-dashboard/mascotas/types';

// Función para cargar imagen como base64
const getImageAsBase64 = async (imageUrl: string): Promise<string | null> => {
    try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => resolve(null);
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error('Error loading image:', error);
        return null;
    }
};

export const generateMascotaPDF = async (data: MascotaPageDetails): Promise<void> => {
    const pdf = new jsPDF('l', 'mm', [85.6, 53.98]); // Tamaño ID card estándar
    
    // Colores minimalistas tipo DNI peruano
    const navyBlue = [41, 72, 121] as const;        // Azul institucional suave
    const lightBlue = [230, 240, 250] as const;     // Fondo azul muy claro
    const textDark = [40, 40, 40] as const;         // Texto principal
    const textMuted = [100, 100, 100] as const;     // Texto secundario
    const borderGray = [200, 200, 200] as const;    // Bordes sutiles
    const white = [255, 255, 255] as const;

    // Fondo blanco base
    pdf.setFillColor(...white);
    pdf.rect(0, 0, 85.6, 53.98, 'F');

    // Header simple con línea azul
    pdf.setFillColor(...lightBlue);
    pdf.rect(0, 0, 85.6, 14, 'F');
    
    // Borde inferior del header
    pdf.setDrawColor(...navyBlue);
    pdf.setLineWidth(0.5);
    pdf.line(0, 14, 85.6, 14);

    // Escudo/Logo simple
    pdf.setFillColor(...white);
    pdf.circle(8, 7, 4.5, 'F');
    pdf.setDrawColor(...navyBlue);
    pdf.setLineWidth(0.5);
    pdf.circle(8, 7, 4.5, 'D');
    
    // Iniciales
    pdf.setTextColor(...navyBlue);
    pdf.setFontSize(7);
    pdf.setFont('helvetica', 'bold');
    pdf.text('MD', 5.8, 8.2);

    // Título institucional simple
    pdf.setTextColor(...navyBlue);
    pdf.setFontSize(6);
    pdf.setFont('helvetica', 'bold');
    pdf.text('MUNICIPALIDAD DISTRITAL', 15, 5);
    pdf.setFontSize(7.5);
    pdf.text('ANDRÉS AVELINO CÁCERES DORREGARAY', 15, 9.5);

    // Subtítulo
    pdf.setFontSize(5);
    pdf.setFont('helvetica', 'normal');
    pdf.text('DOCUMENTO DE IDENTIDAD ANIMAL', 15, 12.5);

    // === FOTO ===
    const photoX = 4;
    const photoY = 17;
    const photoWidth = 22;
    const photoHeight = 27;
    
    // Borde de foto simple
    pdf.setDrawColor(...borderGray);
    pdf.setLineWidth(0.3);
    pdf.rect(photoX, photoY, photoWidth, photoHeight, 'D');

    // Intentar cargar foto real
    let photoAdded = false;
    if (data.fotoUrl) {
        try {
            const imageBase64 = await getImageAsBase64(data.fotoUrl);
            if (imageBase64) {
                pdf.addImage(imageBase64, 'JPEG', photoX, photoY, photoWidth, photoHeight);
                photoAdded = true;
            }
        } catch (error) {
            console.error('Error adding photo to PDF:', error);
        }
    }

    // Placeholder simple si no hay foto
    if (!photoAdded) {
        pdf.setFillColor(245, 245, 245);
        pdf.rect(photoX, photoY, photoWidth, photoHeight, 'F');
        
        pdf.setTextColor(180, 180, 180);
        pdf.setFontSize(4);
        pdf.setFont('helvetica', 'normal');
        pdf.text('FOTOGRAFÍA', photoX + 5, photoY + photoHeight/2);
    }

    // === INFORMACIÓN PRINCIPAL ===
    const mainX = 28;
    let yPos = 17;

    // Número de ID
    pdf.setTextColor(...textMuted);
    pdf.setFontSize(3.8);
    pdf.setFont('helvetica', 'normal');
    pdf.text('N° DE IDENTIFICACIÓN', mainX, yPos);
    
    pdf.setTextColor(...navyBlue);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text(data.identificador, mainX, yPos + 4.5);

    // Línea separadora
    pdf.setDrawColor(...borderGray);
    pdf.setLineWidth(0.2);
    pdf.line(mainX, yPos + 6, 64, yPos + 6);

    yPos += 8;

    // Nombre de la mascota (más compacto)
    pdf.setTextColor(...textMuted);
    pdf.setFontSize(3.8);
    pdf.setFont('helvetica', 'normal');
    pdf.text('NOMBRE DE LA MASCOTA', mainX, yPos);
    
    pdf.setTextColor(...textDark);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.text(data.nombre.toUpperCase(), mainX, yPos + 4);

    yPos += 6;

    // Grid simple de información (más compacto)
    const col1X = mainX;
    const col2X = mainX + 18;
    const labelSize = 3.5;
    const valueSize = 6;
    const spacing = 5.5;

    // Especie
    pdf.setTextColor(...textMuted);
    pdf.setFontSize(labelSize);
    pdf.setFont('helvetica', 'normal');
    pdf.text('ESPECIE', col1X, yPos);
    pdf.setTextColor(...textDark);
    pdf.setFontSize(valueSize);
    pdf.setFont('helvetica', 'bold');
    pdf.text(data.especie.toUpperCase(), col1X, yPos + 3.5);

    // Raza
    pdf.setTextColor(...textMuted);
    pdf.setFontSize(labelSize);
    pdf.setFont('helvetica', 'normal');
    pdf.text('RAZA', col2X, yPos);
    pdf.setTextColor(...textDark);
    pdf.setFontSize(valueSize);
    pdf.setFont('helvetica', 'bold');
    const razaText = data.raza.length > 11 ? data.raza.substring(0, 11) + '.' : data.raza;
    pdf.text(razaText.toUpperCase(), col2X, yPos + 3.5);

    yPos += spacing;

    // Sexo
    pdf.setTextColor(...textMuted);
    pdf.setFontSize(labelSize);
    pdf.setFont('helvetica', 'normal');
    pdf.text('SEXO', col1X, yPos);
    pdf.setTextColor(...textDark);
    pdf.setFontSize(valueSize);
    pdf.setFont('helvetica', 'bold');
    pdf.text(data.sexo.toUpperCase(), col1X, yPos + 3.5);

    // Color
    pdf.setTextColor(...textMuted);
    pdf.setFontSize(labelSize);
    pdf.setFont('helvetica', 'normal');
    pdf.text('COLOR', col2X, yPos);
    pdf.setTextColor(...textDark);
    pdf.setFontSize(valueSize);
    pdf.setFont('helvetica', 'bold');
    pdf.text(data.color.toUpperCase(), col2X, yPos + 3.5);

    yPos += spacing;

    // Edad (solo años)
    pdf.setTextColor(...textMuted);
    pdf.setFontSize(labelSize);
    pdf.setFont('helvetica', 'normal');
    pdf.text('EDAD', col1X, yPos);
    pdf.setTextColor(...textDark);
    pdf.setFontSize(valueSize);
    pdf.setFont('helvetica', 'bold');
    // Extraer solo los años (ejemplo: "4 años, 3 meses" -> "4 AÑOS")
    const edadSoloAnios = data.edad.split(',')[0].trim().toUpperCase();
    pdf.text(edadSoloAnios, col1X, yPos + 3.5);

    // Estado
    pdf.setTextColor(...textMuted);
    pdf.setFontSize(labelSize);
    pdf.setFont('helvetica', 'normal');
    pdf.text('ESTADO', col2X, yPos);
    
    const isActive = data.estado.toLowerCase().includes('activo');
    pdf.setTextColor(isActive ? 34 : 200, isActive ? 139 : 50, isActive ? 34 : 50);
    pdf.setFontSize(valueSize);
    pdf.setFont('helvetica', 'bold');
    pdf.text(data.estado.toUpperCase(), col2X, yPos + 3.5);

    // === QR CODE REAL ===
    const qrSize = 16;
    const qrX = 67;
    const qrY = 17;
    
    // Generar QR code real con la URL de verificación
    try {
        const qrUrl = `https://veterinaria.gob.pe/verificar/${data.identificador}`;
        const qrDataUrl = await QRCode.toDataURL(qrUrl, {
            width: qrSize * 10, // Alta resolución
            margin: 1,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        });
        
        // Agregar el QR code como imagen
        pdf.addImage(qrDataUrl, 'PNG', qrX, qrY, qrSize, qrSize);
        
    } catch (error) {
        console.error('Error generating QR code:', error);
        
        // Fallback: mostrar borde si falla
        pdf.setDrawColor(...borderGray);
        pdf.setLineWidth(0.3);
        pdf.rect(qrX, qrY, qrSize, qrSize, 'D');
        
        pdf.setFillColor(245, 245, 245);
        pdf.rect(qrX, qrY, qrSize, qrSize, 'F');
        
        pdf.setTextColor(180, 180, 180);
        pdf.setFontSize(3);
        pdf.text('QR ERROR', qrX + 4, qrY + qrSize/2);
    }

    // Label QR
    pdf.setTextColor(...textMuted);
    pdf.setFontSize(3.2);
    pdf.setFont('helvetica', 'normal');
    pdf.text('CÓDIGO QR', qrX + 2, qrY + qrSize + 3);

    // === FOOTER ===
    const footerY = 44.5;
    
    // Información del propietario (pequeño y simple)
    pdf.setTextColor(...textMuted);
    pdf.setFontSize(3);
    pdf.setFont('helvetica', 'normal');
    pdf.text('PROPIETARIO REGISTRADO', 4, footerY + 2.5);
    
    pdf.setTextColor(...textDark);
    pdf.setFontSize(5);
    pdf.setFont('helvetica', 'bold');
    const ownerName = data.dueno.nombre.length > 35 
        ? data.dueno.nombre.substring(0, 35) + '...' 
        : data.dueno.nombre;
    pdf.text(ownerName.toUpperCase(), 4, footerY + 5.5);

    // Fecha de expedición
    pdf.setTextColor(...textMuted);
    pdf.setFontSize(3);
    pdf.setFont('helvetica', 'normal');
    pdf.text('FECHA EXP.', 58, footerY + 2.5);
    
    pdf.setTextColor(...navyBlue);
    pdf.setFontSize(7);
    pdf.setFont('helvetica', 'bold');
    const registerDate = new Date(data.createdAt);
    const formattedDate = `${registerDate.getDate().toString().padStart(2, '0')}/${(registerDate.getMonth() + 1).toString().padStart(2, '0')}/${registerDate.getFullYear()}`;
    pdf.text(formattedDate, 58, footerY + 6);

    // Borde final muy sutil
    pdf.setDrawColor(...borderGray);
    pdf.setLineWidth(0.5);
    pdf.rect(1, 1, 83.6, 51.98, 'D');

    // Descargar
    const filename = `DIM_${data.identificador}_${data.nombre.replace(/\s+/g, '_').toLowerCase()}.pdf`;
    pdf.save(filename);
};