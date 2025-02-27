import gradio as gr
from dataclasses import dataclass
from typing import Optional, Tuple

@dataclass
class UserState:
    name: str = ""
    estate_value: float = 0
    relationship_status: str = ""
    has_children: bool = False
    has_grandchildren: bool = False
    has_great_grandchildren: bool = False
    has_living_parents: bool = False
    has_siblings: bool = False
    has_grandparents: bool = False
    has_aunts_uncles: bool = False
    current_question: int = 0

def determine_distribution(state: UserState) -> Optional[str]:
    estate = state.estate_value
    formatted_value = f"£{estate:,.2f}"
    
    if state.relationship_status == "Married":
        if not state.has_children:
            return f"{state.name}, your entire estate of {formatted_value} will pass to your spouse. If you wish to change this, you will need to create a Will."
        else:
            spouse_threshold = 322000
            if estate <= spouse_threshold:
                spouse_amount = estate
                children_amount = 0
            else:
                excess = estate - spouse_threshold
                spouse_amount = spouse_threshold + (excess / 2)
                children_amount = excess / 2
            return f"{state.name}, your spouse will inherit £{spouse_amount:,.2f} (£322,000 plus half of the remainder), and your children will share £{children_amount:,.2f} (half of the remainder). If you wish to change this, you will need to create a Will."

    # Continue with other conditions...

def get_next_question(state: UserState) -> Tuple[Optional[str], Optional[str]]:
    questions = [
        ("Hi, what is your name?", None),
        ("What is your approximate estate value?", None),
        ("What is your relationship status?", "radio"),
        ("Do you have any children?", "radio"),
        ("Do you have any living grandchildren?", "radio"),
        # Add more questions as needed...
    ]
    
    if state.current_question >= len(questions):
        return None, None
        
    return questions[state.current_question]

with gr.Blocks() as app:
    gr.Markdown("## UK Intestacy Calculator")
    
    state = UserState()
    
    name_input = gr.Textbox(label="Name", visible=True)
    estate_value = gr.Number(label="Estate Value (£)", visible=False)
    relationship_status = gr.Radio(
        choices=["Single", "Married", "Divorced", "Widowed"],
        label="Relationship Status",
        visible=False
    )
    yes_no = gr.Radio(choices=["Yes", "No"], label="Answer", visible=False)
    result = gr.Textbox(label="Result", visible=False)
    
    def update_interface(name, value, status, answer):
        # Logic to update state and determine next question
        # ...existing code...
        pass

    next_button = gr.Button("Continue")
    next_button.click(
        fn=update_interface,
        inputs=[name_input, estate_value, relationship_status, yes_no],
        outputs=[name_input, estate_value, relationship_status, yes_no, result]
    )

app.launch()
