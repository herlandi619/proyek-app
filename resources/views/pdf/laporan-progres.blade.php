<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Laporan Progres - {{ $projectName }}</title>
    <style>
        /* Gaya CSS khusus DomPDF (Hindari Flexbox/Grid) */
        body {
            font-family: Arial, Helvetica, sans-serif;
            font-size: 12px;
            color: #333;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
        }
        .header h2 {
            margin: 0 0 5px 0;
            font-size: 18px;
            text-transform: uppercase;
        }
        .header p {
            margin: 0;
            font-size: 13px;
            color: #555;
        }
        .info-table {
            width: 100%;
            margin-bottom: 20px;
        }
        .info-table td {
            padding: 3px 0;
        }
        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        .data-table th, .data-table td {
            border: 1px solid #777;
            padding: 8px;
            text-align: left;
            vertical-align: top;
        }
        .data-table th {
            background-color: #f2f2f2;
            font-weight: bold;
            text-align: center;
        }
        .text-center {
            text-align: center;
        }
        .photo-container {
            margin-top: 8px;
        }
        .photo {
            width: 90px;
            height: 70px;
            object-fit: cover;
            margin-right: 5px;
            margin-bottom: 5px;
            border: 1px solid #ccc;
        }
    </style>
</head>
<body>

    <div class="header">
        <h2>Laporan Kemajuan Proyek Konstruksi</h2>
        <p>Sistem Pemantauan Proyek Terpadu</p>
    </div>

    <table class="info-table">
        <tr>
            <td width="15%"><strong>Proyek</strong></td>
            <td width="2%">:</td>
            <td>{{ $projectName }}</td>
        </tr>
        <tr>
            <td><strong>Periode</strong></td>
            <td>:</td>
            <td>
                @if($startDate && $endDate)
                    {{ \Carbon\Carbon::parse($startDate)->format('d/m/Y') }} s/d {{ \Carbon\Carbon::parse($endDate)->format('d/m/Y') }}
                @elseif($startDate)
                    Sejak {{ \Carbon\Carbon::parse($startDate)->format('d/m/Y') }}
                @elseif($endDate)
                    Hingga {{ \Carbon\Carbon::parse($endDate)->format('d/m/Y') }}
                @else
                    Keseluruhan (Semua Waktu)
                @endif
            </td>
        </tr>
        <tr>
            <td><strong>Dicetak Pada</strong></td>
            <td>:</td>
            <td>{{ $tanggalCetak }}</td>
        </tr>
    </table>

    <table class="data-table">
        <thead>
            <tr>
                <th width="5%">No</th>
                <th width="12%">Tanggal</th>
                <th width="20%">Item Pekerjaan</th>
                <th width="15%">Dilaporkan Oleh</th>
                <th width="8%">Progres</th>
                <th width="40%">Catatan & Dokumentasi</th>
            </tr>
        </thead>
        <tbody>
            @forelse($reports as $index => $report)
                <tr>
                    <td class="text-center">{{ $index + 1 }}</td>
                    <td class="text-center">{{ \Carbon\Carbon::parse($report->tanggal_laporan)->format('d/m/Y') }}</td>
                    <td>
                        <strong>{{ $report->workItem->nama_item ?? '-' }}</strong><br>
                        <span style="font-size: 10px; color: #555;">{{ $report->workItem->project->nama_proyek ?? '-' }}</span>
                    </td>
                    <td>{{ $report->user->name ?? '-' }}</td>
                    <td class="text-center">
                        <strong style="color: #15803d;">{{ $report->persentase_progres }}%</strong>
                    </td>
                    <td>
                        <div style="margin-bottom: 8px;">
                            {{ $report->catatan ?: 'Tidak ada catatan.' }}
                        </div>
                        
                        @if($report->progressPhotos && $report->progressPhotos->count() > 0)
                            <div class="photo-container">
                                @foreach($report->progressPhotos as $photo)
                                    <!-- WAJIB menggunakan public_path() agar DomPDF bisa membaca file lokal -->
                                    <img src="{{ public_path('storage/' . $photo->path_foto) }}" class="photo" alt="Dokumentasi">
                                @endforeach
                            </div>
                        @endif
                    </td>
                </tr>
            @empty
                <tr>
                    <td colspan="6" class="text-center">Tidak ada data laporan progres yang sesuai dengan filter Anda.</td>
                </tr>
            @endforelse
        </tbody>
    </table>

</body>
</html>