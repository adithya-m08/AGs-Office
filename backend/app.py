from flask import Flask, request, jsonify, send_from_directory, send_file
from flask_cors import CORS  # Import CORS from flask_cors
import pandas as pd
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for your Flask app

PDF_FOLDER = os.path.join(os.path.dirname(__file__), '..', 'resources', 'pdfs')
EXCEL_PATH = 'resources/data.xlsx'
app.config['PDF_FOLDER'] = PDF_FOLDER

@app.route('/verify', methods=['POST'])
def verify():
    file_id = int(request.form['fileid'])
    name = request.form['name']
    dob = request.form['dob']
    dor = request.form['dor']

    # Load the Excel file
    df = pd.read_excel(EXCEL_PATH)

    # Filter rows based on file_id, name, dob, dor
    filtered_df = df[(df['FILE_ID'] == file_id) &
                     (df['PNSR_FULL_NAME'] == name) &
                     (df['DOB'] == dob) &
                     (df['DOA'] == dor)].copy()

    if filtered_df.empty:
        return jsonify({'success': False, 'message': 'Verification failed'})

    # Concatenate PPO_NUMBER and APPLN_NO columns using .loc
    filtered_df.loc[:, 'concatenated'] = filtered_df['APPLN_NO'].astype(str) + '_' + filtered_df['PPO_NUMBER'].astype(str)

    # Get list of PDFs to download
    pdf_list = []
    for row in filtered_df.itertuples():
        pdf_list.extend([f for f in os.listdir(app.config['PDF_FOLDER']) if f.startswith(row.concatenated)])

    return jsonify({'success': True, 'pdf_list': pdf_list})

@app.route('/pdf_folder/<path:filename>', methods=['GET'])
def download_pdf(filename):
    pdf_path = os.path.join(PDF_FOLDER, filename)
    return send_file(pdf_path, as_attachment=True)


if __name__ == '__main__':
    app.run(debug=True)
