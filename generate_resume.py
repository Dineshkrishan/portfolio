import os
from fpdf import FPDF

def create_attached_latex_resume():
    pdf = FPDF(orientation='P', unit='mm', format='A4')
    pdf.set_margins(15, 12, 15)
    pdf.set_auto_page_break(auto=False)
    pdf.add_page()
    
    epw = pdf.epw # ~180mm

    # Header Name - LaTeX Style Computer Modern / Times
    pdf.set_font('Times', 'B', 22)
    pdf.cell(epw, 8, 'G. DINESH KRISHAN', new_x="LMARGIN", new_y="NEXT", align='C')
    
    # Contact Row 1
    pdf.set_font('Times', '', 10)
    pdf.cell(epw, 5, 'Bengaluru  |  8143155225  |  dineshkrishan1981@gmail.com', new_x="LMARGIN", new_y="NEXT", align='C')
    
    # Contact Row 2 Links
    pdf.set_font('Times', 'U', 9.5)
    pdf.cell(epw, 4.5, 'LinkedIn: linkedin.com/in/dineshkrishan  |  GitHub: github.com/Dineshkrishan  |  HackerRank', new_x="LMARGIN", new_y="NEXT", align='C')
    
    pdf.ln(2)
    
    def section_header(title):
        pdf.set_font('Times', 'B', 11)
        pdf.cell(epw, 5, title, new_x="LMARGIN", new_y="NEXT")
        pdf.set_draw_color(0, 0, 0)
        pdf.set_line_width(0.4)
        y = pdf.get_y()
        pdf.line(15, y, 15 + epw, y)
        pdf.ln(1.5)

    # 1. Education
    section_header('Education')
    pdf.set_font('Times', 'B', 10)
    pdf.cell(135, 4.5, 'Dayananda Sagar Academy of Technology and Management', new_x="RIGHT", new_y="TOP")
    pdf.set_font('Times', 'B', 9.5)
    pdf.cell(epw - 135, 4.5, 'Dec 2022 - June 2026', new_x="LMARGIN", new_y="NEXT", align='R')
    
    pdf.set_font('Times', 'I', 9.5)
    pdf.cell(135, 4.5, 'B.E. in Artificial Intelligence and Machine Learning', new_x="RIGHT", new_y="TOP")
    pdf.set_font('Times', '', 9.5)
    pdf.cell(epw - 135, 4.5, 'Bengaluru, India', new_x="LMARGIN", new_y="NEXT", align='R')
    
    pdf.set_font('Times', '', 9)
    pdf.cell(epw, 4, '- CGPA: 8.01/10', new_x="LMARGIN", new_y="NEXT")
    pdf.multi_cell(epw, 4, '- Coursework: Data Structures, Algorithms, Database Management Systems, Software Engineering, Operating Systems, Computer Networks, OOPs in Java, Machine Learning, Generative AI, Natural Language Processing', new_x="LMARGIN", new_y="NEXT")
    
    pdf.ln(2)

    # 2. Technical Skills
    section_header('Technical Skills')
    skills = [
        ('Programming Languages: ', 'C, Java, Python, HTML, CSS, JavaScript'),
        ('Libraries/Frameworks & Tools: ', 'VS Code, Git, GitHub, IntelliJ, NumPy, Pandas, PyTorch, Scikit-learn'),
        ('Databases: ', 'SQL, MongoDB'),
        ('DevOps/Cloud: ', 'GCP, AWS, Docker, CI/CD Pipelines, Cloud Fundamentals')
    ]
    for lbl, val in skills:
        pdf.set_font('Times', 'B', 9)
        pdf.write(4, lbl)
        pdf.set_font('Times', '', 9)
        pdf.write(4, val + '\n')
    
    pdf.ln(2)

    # 3. Internship
    section_header('Internship')
    pdf.set_font('Times', 'B', 10)
    pdf.cell(135, 4.5, 'CBAServices Private Limited', new_x="RIGHT", new_y="TOP")
    pdf.set_font('Times', 'B', 9.5)
    pdf.cell(epw - 135, 4.5, 'Jan 2026 - Jul 2026', new_x="LMARGIN", new_y="NEXT", align='R')
    
    pdf.set_font('Times', 'I', 9.5)
    pdf.cell(epw, 4.5, 'Software Development Trainee', new_x="LMARGIN", new_y="NEXT")
    
    pdf.set_font('Times', '', 9)
    bullets = [
        'Developed "RevPlay," a music streaming platform with a RESTful API backend and a React-based UI for browsing and playback',
        'Built "AssetFlow Management," a financial intelligence platform using FastAPI, React/Vite, and MongoDB, integrated with an Ollama-powered AI advisor for insights.',
        'Implemented CRUD operations and MongoDB data workflows, and set up cloud deployment pipelines on GCP/AWS.'
    ]
    for b in bullets:
        pdf.multi_cell(epw, 4, f'- {b}', new_x="LMARGIN", new_y="NEXT")

    pdf.ln(2)

    # 4. Projects
    section_header('Projects')
    
    # Project 1
    pdf.set_font('Times', 'B', 9.5)
    pdf.cell(115, 4.5, 'Signature Recognition System |', new_x="RIGHT", new_y="TOP")
    pdf.set_font('Times', 'U', 9)
    pdf.cell(epw - 115, 4.5, 'github.com/Dineshkrishan/Image-processing', new_x="LMARGIN", new_y="NEXT", align='R')
    pdf.set_font('Times', '', 8.8)
    pdf.multi_cell(epw, 3.8, '- Built a dual-platform signature forgery detection system (Flask web app + native Android app via Chaquopy) using a 6-metric similarity engine (MSE, SSIM, template matching, histogram correlation, HOG, NMI) across a 16x16 grid, avoiding GPU-dependent deep learning.', new_x="LMARGIN", new_y="NEXT")
    pdf.multi_cell(epw, 3.8, '- Designed an adaptive baseline engine that flags a signature as forged if it underperforms the genuine-sample baseline on 3+ of the 6 metrics.', new_x="LMARGIN", new_y="NEXT")
    pdf.set_font('Times', 'B', 8.8)
    pdf.write(3.8, '- Tools: ')
    pdf.set_font('Times', '', 8.8)
    pdf.write(3.8, 'Python, OpenCV, scikit-image, scikit-learn, Flask, Kotlin, Jetpack Compose, Chaquopy.\n')

    pdf.ln(1.5)

    # Project 2
    pdf.set_font('Times', 'B', 9.5)
    pdf.cell(115, 4.5, 'RAG PDF Chatbot |', new_x="RIGHT", new_y="TOP")
    pdf.set_font('Times', 'U', 9)
    pdf.cell(epw - 115, 4.5, 'github.com/Dineshkrishan/RAG', new_x="LMARGIN", new_y="NEXT", align='R')
    pdf.set_font('Times', '', 8.8)
    pdf.multi_cell(epw, 3.8, '- Built a RAG-based PDF chatbot (LangChain + FAISS) supporting uploads up to 200MB, with automatic chunking, embedding, and semantic search.', new_x="LMARGIN", new_y="NEXT")
    pdf.multi_cell(epw, 3.8, '- Integrated HuggingFace\'s all-MiniLM-L6-v2 embeddings with Mistral 7B via OpenRouter API to generate context-aware answers, served through a Streamlit UI.', new_x="LMARGIN", new_y="NEXT")
    pdf.set_font('Times', 'B', 8.8)
    pdf.write(3.8, '- Tools: ')
    pdf.set_font('Times', '', 8.8)
    pdf.write(3.8, 'Python, LangChain, FAISS, HuggingFace, Streamlit, OpenRouter API.\n')

    pdf.ln(1.5)

    # Project 3
    pdf.set_font('Times', 'B', 9.5)
    pdf.cell(115, 4.5, 'Orchestrated Multi-Agent Investment System |', new_x="RIGHT", new_y="TOP")
    pdf.set_font('Times', 'U', 9)
    pdf.cell(epw - 115, 4.5, 'github.com/Dineshkrishan/Orchestrated-Multi-Agent-Investment-System', new_x="LMARGIN", new_y="NEXT", align='R')
    pdf.set_font('Times', '', 8.8)
    pdf.multi_cell(epw, 3.8, '- Engineered a 3-agent orchestration system in Python that autonomously monitors, strategizes, and generates investment predictions using real-time financial APIs.', new_x="LMARGIN", new_y="NEXT")
    pdf.multi_cell(epw, 3.8, '- Integrated live financial data feeds into a scalable agent framework, enabling collaborative decision-making across market analysis and strategy planning modules.', new_x="LMARGIN", new_y="NEXT")
    pdf.set_font('Times', 'B', 8.8)
    pdf.write(3.8, '- Tools used: ')
    pdf.set_font('Times', '', 8.8)
    pdf.write(3.8, 'Python, Multi-Agent Systems, Financial Data APIs, Pandas, NumPy, HTML, CSS.\n')

    pdf.ln(2)

    # 5. Certifications
    section_header('Certifications')
    pdf.set_font('Times', '', 9)
    certs = [
        'Google: Introduction to AI and Machine Learning on Google Cloud',
        'Nvidia: Getting Started with Deep Learning Course for Foundational Deep Learning Skills',
        'AWS: Building Language Models on AWS',
        'Infosys: Basics of Python and Python Foundation',
        'Udemy: UI/UX Design Essentials'
    ]
    for c in certs:
        pdf.cell(epw, 4, f'Google / Industry: {c}' if 'Google' in c else f'- {c}', new_x="LMARGIN", new_y="NEXT")

    output_path = 'G_Dinesh_Krishan_Resume.pdf'
    pdf.output(output_path)
    print(f"Attached PDF resume compiled successfully at {output_path}")

if __name__ == '__main__':
    create_attached_latex_resume()
