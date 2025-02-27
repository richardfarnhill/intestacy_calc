import gradio as gr
from dataclasses import dataclass

@dataclass
class Result:
    value: str

def determine_estate_distribution(estate_value):
    formatted_value = f"£{estate_value:,.2f}"
    
    def format_response(message):
        return None, Result(message)

    # Check each case and return appropriate distribution message
    if state.get("married") and not state.get("children"):
        return format_response(f"Your entire estate of {formatted_value} will pass to your spouse/civil partner")
    
    elif state.get("married") and state.get("children"):
        spouse_share = 322000
        children_share = estate_value - spouse_share
        message = (f"Your spouse/civil partner will receive: £{spouse_share:,.2f}\n"
                  f"Your children will share equally: £{children_share:,.2f}")
        return None, Result(message)
    
    elif state.get("children"):
        return format_response(f"Your entire estate of {formatted_value} will be divided equally between your children")
    
    elif state.get("parents_alive"):
        return format_response(f"Your entire estate of {formatted_value} will pass to your surviving parent(s) in equal shares")
    
    elif state.get("siblings"):
        return format_response(f"Your entire estate of {formatted_value} will be divided equally between your siblings (or their children)")
    
    elif state.get("grandparents"):
        return format_response(f"Your entire estate of {formatted_value} will pass to your surviving grandparents in equal shares")
    
    elif state.get("aunts_uncles"):
        return format_response(f"Your entire estate of {formatted_value} will be divided equally between your aunts/uncles (or their children)")
    
    else:
        return format_response("Your estate will pass to the Crown (Bona Vacantia) as no eligible relatives have been identified")

# Create Gradio interface
with gr.Blocks() as app:
    gr.Markdown("## UK Intestacy Calculator")
    gr.Markdown("Answer the following questions to determine how your estate would be distributed if you died without a will")
    
    estate_value = gr.Number(label="What is the total value of your estate (£)?")
    current_question = gr.Textbox(label="Question")
    yes_no = gr.Radio(["Yes", "No"], label="Your Answer")
    output = gr.Textbox(label="Distribution Result", visible=False)
    
    def on_submit(value, question, answer):
        if not question:
            question, output_update = determine_estate_distribution(value)
            return question, output_update
        
        if can_determine_distribution(state):
            return "", calculate_distribution(state, value)
            
        state["current_question"] += 1
        return questions[state["current_question"]], gr.Textbox.update(visible=False)
    
    submit = gr.Button("Continue")
    submit.click(
        fn=on_submit,
        inputs=[estate_value, current_question, yes_no],
        outputs=[current_question, output]
    )

app.launch()
