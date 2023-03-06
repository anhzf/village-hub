export default ({
  recipientName,
  recipientLocation = 'tempat',
  eventTitle,
  eventDatetime,
  eventDatetimeEnd,
  eventLocation,
  organizer,
  organizerName,
}: {
  recipientName: string;
  recipientLocation?: string;
  eventTitle: string;
  eventDatetime: Date;
  eventDatetimeEnd?: Date;
  eventLocation: string;
  organizer: string;
  organizerName: string;
}) => `Kepada: ${recipientName}
Di ${recipientLocation}

Dengan hormat kami mengharap kehadiran Bapak/Ibu/Saudara dalam kegiatan/acara.

Keperluan: ${eventTitle}
Waktu: ${eventDatetime.toLocaleString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
Tanggal: ${[eventDatetime.toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit' }), eventDatetimeEnd?.toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit' }) || 'selesai'].join(' - ')}
Tempat: ${eventLocation}

Untuk konfirmasi kehadiran silakan klik tombol dibawah berikut. Atas perhatiannya kami ucapkan Terima Kasih.

${organizer},

${organizerName}

*Informasi lebih lanjut silakan balas chat ini`